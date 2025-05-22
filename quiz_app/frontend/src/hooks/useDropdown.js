import { useState, useEffect, useRef, useCallback } from 'react';

export const useDropdown = (initialValue = null, options = []) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const dropdownRef = useRef(null);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const selectOption = useCallback((value, callback) => {
    setSelectedValue(value);
    setIsOpen(false);
    if (callback) {
      callback(value);
    }
  }, []);

  const getSelectedOption = useCallback(() => {
    return options.find(option => option.value === selectedValue) || null;
  }, [options, selectedValue]);

  const getDisplayLabel = useCallback(() => {
    const selected = getSelectedOption();
    return selected ? selected.label : 'Select an option';
  }, [getSelectedOption]);

  // Keyboard navigation
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const handleKeyDown = useCallback((event) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex(prev => 
          prev < options.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : options.length - 1
        );
        break;
      
      case 'Enter':
        event.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          selectOption(options[highlightedIndex].value);
        }
        break;
      
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      
      default:
        break;
    }
  }, [isOpen, options, highlightedIndex, selectOption]);

  // Reset highlighted index when options change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [options]);

  return {
    // State
    isOpen,
    selectedValue,
    selectedOption: getSelectedOption(),
    displayLabel: getDisplayLabel(),
    highlightedIndex,
    
    // Refs
    dropdownRef,
    
    // Actions
    toggleDropdown,
    closeDropdown,
    selectOption,
    setSelectedValue,
    handleKeyDown,
    
    // Utilities
    isSelected: (value) => selectedValue === value,
    isHighlighted: (index) => highlightedIndex === index,
  };
};