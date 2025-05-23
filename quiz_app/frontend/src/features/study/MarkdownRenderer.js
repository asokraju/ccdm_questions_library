import React from 'react';

function MarkdownRenderer({ content }) {
  const parseMarkdown = (text) => {
    if (!text) return '';
    
    const lines = text.split('\n');
    let processedLines = [];
    let inCodeBlock = false;
    let codeBlockContent = [];
    let listStack = [];
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // Handle code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          closeAllLists();
          processedLines.push('<pre><code>' + codeBlockContent.join('\n') + '</code></pre>');
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          closeAllLists();
          inCodeBlock = true;
        }
        continue;
      }
      
      if (inCodeBlock) {
        codeBlockContent.push(escapeHtml(line));
        continue;
      }
      
      // Measure indentation
      const indentMatch = line.match(/^(\s*)(.*)/);
      const indentLevel = indentMatch ? indentMatch[1].length : 0;
      const content = indentMatch ? indentMatch[2] : line;
      
      // Empty lines
      if (content.trim() === '') {
        if (listStack.length === 0) {
          processedLines.push('<br/>');
        }
        continue;
      }
      
      // Headers
      if (content.match(/^#{1,6} /)) {
        closeAllLists();
        const headerLevel = (content.match(/^#+/) || [''])[0].length;
        const headerText = content.replace(/^#+\s*/, '');
        processedLines.push(`<h${headerLevel}>${escapeHtml(headerText)}</h${headerLevel}>`);
        continue;
      }
      
      // Numbered lists (1., 2., etc.)
      const numberedMatch = content.match(/^(\d+)\.\s+(.+)/);
      if (numberedMatch) {
        const listLevel = Math.floor(indentLevel / 2);
        adjustListStack(listLevel, 'ol');
        
        const listContent = numberedMatch[2];
        const processedContent = processInlineFormatting(listContent);
        processedLines.push(`<li>${processedContent}</li>`);
        continue;
      }
      
      // Bullet points with **bold** content
      const bulletMatch = content.match(/^[-*+]\s+(.+)/);
      if (bulletMatch) {
        const listLevel = Math.floor(indentLevel / 2);
        adjustListStack(listLevel, 'ul');
        
        const listContent = bulletMatch[1];
        const processedContent = processInlineFormatting(listContent);
        processedLines.push(`<li>${processedContent}</li>`);
        continue;
      }
      
      // Check if next line starts with colon (header split across lines)
      const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
      const nextContent = nextLine.trim();
      
      if (nextContent.match(/^:\s/)) {
        // This line is a header, next line has the content
        const headerText = content;
        const contentText = nextContent.replace(/^:\s/, '');
        
        // Determine if we should be in a list
        const listLevel = Math.floor(indentLevel / 2);
        adjustListStack(listLevel, 'ul');
        
        const processedHeader = processInlineFormatting(headerText);
        const processedContentText = processInlineFormatting(contentText);
        processedLines.push(`<li><strong>${processedHeader}:</strong> ${processedContentText}</li>`);
        
        i++; // Skip the next line since we processed it
        continue;
      }
      
      // Content with colon on same line (header: content)
      const colonMatch = content.match(/^([^:]+):\s*(.+)/);
      if (colonMatch && indentLevel > 0) {
        const headerText = colonMatch[1];
        const contentText = colonMatch[2];
        const listLevel = Math.floor(indentLevel / 2);
        adjustListStack(listLevel, 'ul');
        
        const processedHeader = processInlineFormatting(headerText);
        const processedContentText = processInlineFormatting(contentText);
        processedLines.push(`<li><strong>${processedHeader}:</strong> ${processedContentText}</li>`);
        continue;
      }
      
      // Indented content (treat as list item)
      if (indentLevel >= 2 && content.trim()) {
        const listLevel = Math.floor(indentLevel / 2);
        adjustListStack(listLevel, 'ul');
        
        const processedContent = processInlineFormatting(content);
        processedLines.push(`<li>${processedContent}</li>`);
        continue;
      }
      
      // Check if next line is a bullet or numbered list (section header)
      if (nextContent.match(/^[-*+]\s/) || nextContent.match(/^\d+\.\s/)) {
        closeAllLists();
        const processedContent = processInlineFormatting(content);
        processedLines.push(`<h4>${processedContent}</h4>`);
        continue;
      }
      
      // Regular paragraph
      if (content.trim()) {
        closeAllLists();
        const processedContent = processInlineFormatting(content);
        processedLines.push(`<p>${processedContent}</p>`);
      }
    }
    
    closeAllLists();
    
    let html = processedLines.join('\n');
    html = html.replace(/(<br\/>\s*){3,}/g, '<br/><br/>');
    
    return html;
    
    function adjustListStack(targetLevel, listType = 'ul') {
      // Close extra lists
      while (listStack.length > targetLevel + 1) {
        const closingTag = listStack.pop();
        processedLines.push(`</${closingTag}>`);
      }
      
      // Open needed lists
      while (listStack.length < targetLevel + 1) {
        processedLines.push(`<${listType}>`);
        listStack.push(listType);
      }
    }
    
    function closeAllLists() {
      while (listStack.length > 0) {
        const closingTag = listStack.pop();
        processedLines.push(`</${closingTag}>`);
      }
    }
  };
  
  const processInlineFormatting = (text) => {
    let result = escapeHtml(text);
    
    // Bold text
    result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    result = result.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic text
    result = result.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
    result = result.replace(/(?<!_)_([^_]+)_(?!_)/g, '<em>$1</em>');
    
    // Inline code
    result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Links
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    return result;
  };
  
  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };
  
  const htmlContent = parseMarkdown(content);
  
  return (
    <div 
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

export default MarkdownRenderer;