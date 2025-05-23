import React, { useRef, useState, useEffect } from 'react';

const SafeInput = ({ value, onChange, placeholder, className, ...props }) => {
  const [localValue, setLocalValue] = useState(value || '');
  const inputRef = useRef(null);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (onChange) {
      onChange(e);
    }
  };

  const handleTouchStart = (e) => {
    if (isIOS) {
      // Prevent default to avoid iOS issues
      e.stopPropagation();
    }
  };

  const handleClick = (e) => {
    if (isIOS) {
      // For iOS, handle click differently
      e.stopPropagation();
      if (inputRef.current) {
        // Use a small delay to avoid iOS timing issues
        setTimeout(() => {
          try {
            inputRef.current.focus();
          } catch (err) {
            console.log('Focus error caught:', err);
          }
        }, 10);
      }
    }
  };

  // For iOS, use a more defensive approach
  if (isIOS) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        {...props}
      />
    );
  }

  // For non-iOS, use normal input
  return (
    <input
      ref={inputRef}
      type="text"
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  );
};

export default SafeInput;