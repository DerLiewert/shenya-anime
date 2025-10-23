import React from 'react';
import emptyIcon from '@/assets/empty.png';
import clsx from 'clsx';
import './EmptyValueMessage.scss';

interface EmptyValueMessageProps {
  message: string;
  className?: string;
}

export const EmptyValueMessage: React.FC<EmptyValueMessageProps> = ({ message, className }) => {
  return (
    <div className={clsx(className, 'empty-value-message')}>
      <img
        className="empty-value-message__image"
        src={emptyIcon}
        alt="Empty message icon"
        aria-hidden
      />
      <p className="empty-value-message__text fz-16">{message}</p>
    </div>
  );
};
