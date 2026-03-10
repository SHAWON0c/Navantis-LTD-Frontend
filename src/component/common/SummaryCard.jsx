import React from 'react';

const SummaryCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  trend,
  trendDirection = 'up',
  className = '',
}) => {
  const variantClasses = {
    default: 'bg-white border-gray-200',
    primary: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
    success: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
    warning: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
    danger: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
    info: 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200',
  };

  const textColorClasses = {
    default: 'text-gray-900',
    primary: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-amber-600',
    danger: 'text-red-600',
    info: 'text-cyan-600',
  };

  return (
    <div
      className={`${variantClasses[variant]} border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${textColorClasses[variant]} mt-1`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
          )}
          {trend && (
            <div className={`mt-2 flex items-center text-sm ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              <span>{trendDirection === 'up' ? '↑' : '↓'}</span>
              <span className="ml-1">{trend}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${variant === 'default' ? 'bg-gray-100' : `bg-${variant}-200/50`}`}>
            <Icon className={`w-6 h-6 ${textColorClasses[variant]}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
