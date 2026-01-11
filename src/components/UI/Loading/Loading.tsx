import clsx from 'clsx';
import { CryoIcon } from '@/components';
import './Loading.scss';

export const Loading = ({ className }: { className?: string }) => {
  return (
    <div className={clsx(className, 'loading')}>
      <div className="loading__animation">
        <CryoIcon />
        <CryoIcon />
        <CryoIcon />
        <CryoIcon />
        <CryoIcon />
      </div>
      <p className="loading__text fz-16">
        Loading<span>.</span>
        <span>.</span>
        <span>.</span>
      </p>
    </div>
  );
};
