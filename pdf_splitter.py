import os
import sys
import yaml
import json
from pypdf import PdfReader, PdfWriter

# Try to import pdfrw as a fallback
try:
    import pdfrw
    HAVE_PDFRW = True
except ImportError:
    HAVE_PDFRW = False
    
# Try to import fitz (PyMuPDF) as another fallback
try:
    import fitz
    HAVE_PYMUPDF = True
except ImportError:
    HAVE_PYMUPDF = False

def extract_bookmarks_pypdf(pdf_path):
    """Extract bookmarks using pypdf library"""
    reader = PdfReader(pdf_path)
    bookmarks = []
    
    def process_outline(outline, level=0):
        result = []
        for item in outline:
            if isinstance(item, list):
                result.extend(process_outline(item, level + 1))
            else:
                if hasattr(item, '/Title') and hasattr(item, '/Page'):
                    title = item['/Title']
                    
                    # Try to get the page number
                    page_num = None
                    if hasattr(item, 'page'):
                        # Try the direct page property if available
                        page_ref = item.page
                        if page_ref is not None:
                            page_indices = reader.get_destinations_from_outline_item(item)
                            if page_indices and len(page_indices) > 0:
                                page_num = page_indices[0]
                    
                    # If we couldn't get the page, try another approach
                    if page_num is None and '/A' in item and '/D' in item['/A']:
                        dest = item['/A']['/D']
                        if isinstance(dest, list) and len(dest) > 0:
                            page_ref = dest[0]
                            for i, page in enumerate(reader.pages):
                                if page.indirect_reference == page_ref:
                                    page_num = i
                                    break
                    
                    if page_num is not None:
                        bookmark_info = {
                            "title": title,
                            "level": level,
                            "page": page_num
                        }
                        result.append(bookmark_info)
                
                # Process any children
                if hasattr(item, '/First') and hasattr(item, '/Last'):
                    children = []
                    child = item['/First']
                    last = item['/Last']
                    
                    while True:
                        children.append(child)
                        if child == last:
                            break
                        if '/Next' not in child:
                            break
                        child = child['/Next']
                    
                    result.extend(process_outline(children, level + 1))
        
        return result
    
    if reader.outline:
        bookmarks = process_outline(reader.outline)
        
    return bookmarks

def extract_bookmarks_pdfrw(pdf_path):
    """Extract bookmarks using pdfrw library as a fallback"""
    if not HAVE_PDFRW:
        return []
        
    pdf = pdfrw.PdfReader(pdf_path)
    bookmarks = []
    
    def find_page_number(page_ref, pages):
        for i, page in enumerate(pages):
            if page.objid == page_ref.objid:
                return i
        return None
    
    def process_outline(outline, level=0):
        result = []
        current = outline
        
        while current:
            if current.Title:
                page_num = None
                
                # Try to extract page number
                if current.A and current.A.D:
                    dest = current.A.D
                    if isinstance(dest, list) and len(dest) > 0:
                        page_ref = dest[0]
                        page_num = find_page_number(page_ref, pdf.pages)
                
                if page_num is not None:
                    bookmark_info = {
                        "title": current.Title,
                        "level": level,
                        "page": page_num
                    }
                    result.append(bookmark_info)
            
            # Process children
            if current.First:
                result.extend(process_outline(current.First, level + 1))
                
            current = current.Next
            
        return result
    
    if hasattr(pdf, 'Outlines') and pdf.Outlines:
        bookmarks = process_outline(pdf.Outlines.First)
        
    return bookmarks

def extract_bookmarks_pymupdf(pdf_path):
    """Extract bookmarks using PyMuPDF library as another fallback"""
    if not HAVE_PYMUPDF:
        return []
    
    bookmarks = []
    
    try:
        doc = fitz.open(pdf_path)
        toc = doc.get_toc()
        
        for i, (level, title, page) in enumerate(toc):
            # PyMuPDF page numbers are 1-based, convert to 0-based
            bookmark_info = {
                "title": title,
                "level": level - 1,  # Adjust level to match our 0-based scheme
                "page": page - 1  # Adjust page to 0-based
            }
            bookmarks.append(bookmark_info)
        
        doc.close()
    except Exception as e:
        print(f"Error extracting bookmarks with PyMuPDF: {e}")
    
    return bookmarks

def extract_all_bookmarks(pdf_path):
    """Try multiple methods to extract bookmarks"""
    # Try with pypdf first
    bookmarks = extract_bookmarks_pypdf(pdf_path)
    
    # If no bookmarks found, try with pdfrw
    if not bookmarks and HAVE_PDFRW:
        print("No bookmarks found with pypdf, trying pdfrw...")
        bookmarks = extract_bookmarks_pdfrw(pdf_path)
    
    # If still no bookmarks, try with PyMuPDF
    if not bookmarks and HAVE_PYMUPDF:
        print("No bookmarks found with pdfrw, trying PyMuPDF...")
        bookmarks = extract_bookmarks_pymupdf(pdf_path)
    
    return bookmarks

def build_chapter_structure(bookmarks, max_level=0, total_pages=None):
    """
    Convert bookmark list into chapter definitions.
    Only use bookmarks up to max_level as chapter separators.
    """
    if not bookmarks:
        return {"chapters": []}
    
    # Filter bookmarks by level and sort by page number
    chapter_bookmarks = [b for b in bookmarks if b["level"] <= max_level]
    
    # Filter out invalid bookmarks
    if total_pages is not None:
        chapter_bookmarks = [b for b in chapter_bookmarks if 0 <= b["page"] < total_pages]
    
    chapter_bookmarks.sort(key=lambda x: x["page"])
    
    chapters = []
    
    for i, bookmark in enumerate(chapter_bookmarks):
        chapter = {
            "name": bookmark["title"],
            "start_page": bookmark["page"] + 1,  # Convert 0-based to 1-based page numbering
            "output_filename": f"{i+1:02d}_{clean_filename(bookmark['title'])}.pdf"
        }
        
        # Set end page based on the next chapter's start page
        # IMPORTANT CHANGE: We subtract 1 to not include the first page of the next chapter
        if i < len(chapter_bookmarks) - 1:
            chapter["end_page"] = chapter_bookmarks[i+1]["page"]  # No +1 here; this is the actual end page
        # The last chapter will have total_pages set later
        
        chapters.append(chapter)
    
    return {"chapters": chapters}

def clean_filename(title):
    """Create a clean filename from a bookmark title"""
    # Replace invalid filename characters with underscores
    invalid_chars = r'<>:"/\|?*'
    for char in invalid_chars:
        title = title.replace(char, '_')
    # Limit length and remove trailing spaces or dots
    return title.strip().rstrip('.').replace(' ', '_')[:50]

def validate_page_ranges(chapters, total_pages):
    """Make sure all page ranges are valid"""
    valid_chapters = []
    
    for chapter in chapters:
        start_page = chapter.get('start_page', 1)
        end_page = chapter.get('end_page', total_pages + 1)
        
        # Convert to 0-based for internal validation
        start_page_0 = start_page - 1
        end_page_0 = end_page - 1
        
        # Validate and adjust page ranges
        if start_page_0 < 0:
            start_page_0 = 0
        
        if end_page_0 >= total_pages:
            end_page_0 = total_pages - 1
            
        if start_page_0 > end_page_0:
            print(f"Skipping invalid chapter '{chapter.get('name')}': start_page > end_page")
            continue
            
        # Update the chapter with validated page ranges
        valid_chapter = chapter.copy()
        valid_chapter['start_page'] = start_page_0 + 1  # Back to 1-based for config
        valid_chapter['end_page'] = end_page_0 + 1
        valid_chapters.append(valid_chapter)
    
    return valid_chapters

def split_pdf_by_bookmarks(input_pdf, output_folder="split_chapters", save_config=None, max_level=0):
    """
    Split a PDF file into multiple files based on bookmark structure.
    
    Args:
        input_pdf (str): Path to the input PDF file
        output_folder (str): Folder to save the split PDF files
        save_config (str): Path to save the extracted bookmark config (optional)
        max_level (int): Maximum bookmark level to use for splitting (0 = top level only)
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_folder, exist_ok=True)
    
    # Open the PDF file
    reader = PdfReader(input_pdf)
    total_pages = len(reader.pages)
    
    print(f"Analyzing bookmarks in PDF with {total_pages} pages...")
    
    # Try to extract bookmarks using multiple methods
    bookmarks = extract_all_bookmarks(input_pdf)
    
    if not bookmarks:
        print("No bookmarks found in the PDF using any available method.")
        print("Please check if your PDF actually has bookmarks or try installing additional libraries:")
        print("  pip install pdfrw PyMuPDF")
        return
    
    print(f"Found {len(bookmarks)} bookmarks in the PDF.")
    
    # Build chapter structure from bookmarks
    config = build_chapter_structure(bookmarks, max_level, total_pages)
    
    # Set the end page for the last chapter
    if config['chapters']:
        last_chapter = config['chapters'][-1]
        if 'end_page' not in last_chapter:
            last_chapter['end_page'] = total_pages
    
    # Validate all page ranges to prevent errors
    config['chapters'] = validate_page_ranges(config['chapters'], total_pages)
    
    # Save configuration if requested
    if save_config:
        if save_config.endswith(('.yaml', '.yml')):
            with open(save_config, 'w') as f:
                yaml.dump(config, f, default_flow_style=False)
        elif save_config.endswith('.json'):
            with open(save_config, 'w') as f:
                json.dump(config, f, indent=2)
        print(f"Saved bookmark configuration to {save_config}")
    
    # Process each chapter defined in the config
    for chapter_info in config['chapters']:
        # Extract chapter info
        chapter_name = chapter_info.get('name', 'Unnamed Chapter')
        start_page = chapter_info.get('start_page', 1)
        end_page = chapter_info.get('end_page', total_pages)
        output_filename = chapter_info.get('output_filename')
        
        # Adjust for 0-based indexing (config uses 1-based page numbers for user convenience)
        start_page = max(0, start_page - 1)  # Ensure we don't go below 0
        end_page = min(total_pages, end_page - 1)  # Ensure we don't go beyond the PDF
        
        # Skip invalid chapters
        if start_page >= end_page:
            print(f"Skipping invalid chapter '{chapter_name}': start_page >= end_page")
            continue
        
        # Create a PDF writer for this chapter
        chapter_writer = PdfWriter()
        
        # Add all pages for this chapter (with additional checks)
        for page_num in range(start_page, end_page + 1):
            if 0 <= page_num < total_pages:  # Extra safety check
                chapter_writer.add_page(reader.pages[page_num])
            else:
                print(f"Warning: Page {page_num + 1} out of range, skipping")
        
        # Ensure the output filename has .pdf extension
        if not output_filename:
            # Sanitize chapter name for use in filename
            sanitized_name = clean_filename(chapter_name)
            output_filename = f"{sanitized_name}.pdf"
        elif not output_filename.lower().endswith('.pdf'):
            output_filename += '.pdf'
            
        # Save the chapter to a new file
        full_output_path = os.path.join(output_folder, output_filename)
        with open(full_output_path, 'wb') as output_file:
            chapter_writer.write(output_file)
        
        print(f"Saved '{chapter_name}' to {full_output_path} (Pages {start_page + 1}-{end_page + 1})")
    
    print(f"Successfully split PDF into {len(config['chapters'])} files based on bookmarks")

# Usage example
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Split PDF by bookmarks/outlines")
    parser.add_argument("input_pdf", help="Path to the input PDF file")
    parser.add_argument("--output", "-o", default="split_chapters", 
                        help="Output folder for split chapters")
    parser.add_argument("--save-config", "-s", 
                        help="Save the extracted bookmark structure to a config file (YAML or JSON)")
    parser.add_argument("--level", "-l", type=int, default=0,
                        help="Maximum bookmark level to use for splitting (0 = top level only)")
    
    args = parser.parse_args()
    
    split_pdf_by_bookmarks(args.input_pdf, args.output, args.save_config, args.level)
    # python pdf_splitter.py Full-GCDMP-Oct-2013.pdf --level 0 --save-config bookmarks.yaml
    # python pdf_splitter.py Full-GCDMP-Oct-2013.pdf --level 1 --output level_1 --save-config bookmarks_1.yaml
    # python pdf_splitter.py Full-GCDMP-Oct-2013.pdf --level 0 --save-config bookmarks.yaml