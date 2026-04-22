import React, { forwardRef } from 'react';

const FormInput = forwardRef(
  (
    {
      label,
      type = 'text',
      placeholder,
      value,
      onChange,
      disabled = false,
      error,
      helperText,
      required = false,
      size = 'sm',
      icon: Icon,
      className = '',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-2.5 py-1.5 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-sm',
    };

    const inputClasses = `
      w-full ${sizeClasses[size]} 
      border ${error ? 'border-red-500' : 'border-gray-300'}
      rounded-md
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-600
      transition-all duration-200
      ${Icon ? 'pl-10' : ''}
      ${className}
    `;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <input
            ref={ref}
            type={type}
            className={inputClasses}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            {...props}
          />
        </div>

        {error && (
          <p className="text-red-600 text-xs mt-1">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-gray-500 text-xs mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
