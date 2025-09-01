import React from 'react';
import emptyIcon from '@/assets/empty.png';

interface EmptyValueMessageProps {
  message: string;
  className?: string;
}
export const EmptyValueMessage: React.FC<EmptyValueMessageProps> = ({ message, className }) => {
  return (
    <div className={`${className} empty-value-message`}>
      <img className="empty-value-message__image" src={emptyIcon} alt="Icon" aria-hidden />
      <p className="empty-value-message__text">{message}</p>
    </div>
  );
};
