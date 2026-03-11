import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  className = '',
  shadow = 'xs',
  padding = 'xs',
  borderColor = 'gray',
  noBorder = false,
  ...props
}) => {
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const paddingClasses = {
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const borderClasses = {
    gray: 'border-gray-200',
    blue: 'border-blue-200',
    green: 'border-green-200',
    red: 'border-red-200',
  };

  const borderStyle = noBorder ? '' : `border ${borderClasses[borderColor]}`;
  const cardClasses = `bg-white rounded-lg ${borderStyle} ${shadowClasses[shadow]} ${paddingClasses[padding]} transition-all duration-200 hover:shadow-md ${className}`;

  return (
    <div className={cardClasses} {...props}>
      {(title || subtitle || headerAction) && (
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200 p-2">
          {/* <div className="flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div> */}

          <div className="flex items-center gap-3 flex-wrap">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && (
            <div className="ml-4 flex-shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      )}
      <div>
        {children}
      </div>
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;