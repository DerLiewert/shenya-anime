import React from 'react';
import emptyIcon from '@/assets/empty.png';

export const EmptyValueMessage = ({ message }: { message: string }) => {
  return (
    <div className="empty-value-message">
      <img className="empty-value-message__image" src={emptyIcon} alt="Icon" aria-hidden />
      <p className="empty-value-message__text">{message}</p>
    </div>
  );
};
