import React from 'react';

const buttonVariants = {
  primary: 'primary',
  secondary: 'secondary', 
  danger: 'danger',
  study: 'secondary study-button'
};

const Button = React.memo(function Button({ 
  variant = 'secondary', 
  onClick, 
  children, 
  disabled = false,
  type = 'button',
  className = '',
  ...props 
}) {
  const buttonClass = `btn-base ${buttonVariants[variant] || variant} ${className}`.trim();

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;