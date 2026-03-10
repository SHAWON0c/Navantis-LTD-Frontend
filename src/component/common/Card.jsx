import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  className = '',
  shadow = 'soft',
  padding = 'normal',
  ...props
}) => {
  const shadowClasses = {
    none: '',
    soft: 'shadow-soft',
    medium: 'shadow-medium',
    large: 'shadow-large',
  };

  const paddingClasses = {
    none: '',
    small: 'p-3',
    normal: 'p-4',
    large: 'p-6',
  };

  const cardClasses = `bg-white rounded-lg border border-neutral-200 ${shadowClasses[shadow]} ${paddingClasses[padding]} ${className}`;

  return (
    <div className={cardClasses} {...props}>
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-200">
          <div>
            {title && <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>}
            {subtitle && <p className="text-sm text-neutral-600 mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
      {footer && (
        <div className="mt-4 pt-3 border-t border-neutral-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;