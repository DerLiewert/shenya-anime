import clsx from 'clsx';
import emptyIcon from '@/assets/empty.png';
import './EmptyValueMessage.scss';

interface EmptyValueMessageProps {
  message: string;
  className?: string;
}

export const EmptyValueMessage = ({ message, className }: EmptyValueMessageProps) => {
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
