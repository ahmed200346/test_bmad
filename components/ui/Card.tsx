import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card = ({
  children,
  className = '',
}: CardProps) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-container p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
};
