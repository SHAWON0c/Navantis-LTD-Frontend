import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'small',
  disabled = false,
  loading = false,
  icon,
  onClick,
  type = 'button',
  className = '',
  iconPosition = 'left',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    ghost: 'text-blue-600 hover:bg-blue-100 bg-blue-50 focus:ring-blue-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeClasses = {
    small: 'px-2.5 py-1.5 text-xs',
    medium: 'px-3 py-1.5 text-sm',
    large: 'px-4 py-2 text-sm',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  // Render icon properly - if it's a component, render it; if it's JSX, render it
  const IconComponent = icon && typeof icon === 'function' ? icon : null;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {IconComponent && (
        <span className={`${iconPosition === 'left' ? 'mr-1.5' : 'ml-1.5'} text-[14px] leading-none`}>
          <IconComponent />
        </span>
      )}
      {icon && typeof icon !== 'function' && (
        <span className={`${iconPosition === 'left' ? 'mr-1.5' : 'ml-1.5'} text-[14px] leading-none`}>
          {icon}
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;