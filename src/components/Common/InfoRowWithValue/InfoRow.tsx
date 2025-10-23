import React from 'react';
import clsx from 'clsx';
import './InfoRowWithValue.scss';

interface InfoRowProps {
  name: string;
  children: React.ReactNode;
  Tag?: 'li' | 'div';
  className?: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({ name, children, Tag = 'li', className }) => {
  return (
    <Tag className={clsx(className, 'info-row')}>
      <p className="info-row__name">{name}:</p>
      <div className="info-row__values">{children}</div>
    </Tag>
  );
};
