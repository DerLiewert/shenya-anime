import React from 'react';
import { CryoIcon } from '../Icons';

export const Loading = ({ className }: { className?: string }) => {
  return (
    <div className={`${className} loading`}>
      <div className="loading__animation">
        <CryoIcon />
        <CryoIcon />
        <CryoIcon />
        <CryoIcon />
        <CryoIcon />
      </div>
      <p className="loading__text">
        Loading<span>.</span>
        <span>.</span>
        <span>.</span>
      </p>
    </div>
  );
};
