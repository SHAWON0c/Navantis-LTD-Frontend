import React from 'react';
import { MdOutlineArrowForward } from 'react-icons/md';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-soft',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-soft',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    danger: 'bg-error text-white hover:bg-red-700 focus:ring-red-500 shadow-soft',
    success: 'bg-success text-white hover:bg-green-700 focus:ring-green-500 shadow-soft',
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const renderIcon = () => {
    if (loading) return <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />;
    if (icon) {
      const IconComponent = icon;
      return <IconComponent className={`mr-2 ${iconPosition === 'right' ? 'order-last ml-2 mr-0' : ''}`} />;
    }
    return null;
  };

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {renderIcon()}
      {children}
    </button>
  );
};

export default Button;