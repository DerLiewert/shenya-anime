import React from 'react';
import { CryoIcon } from '../Icons';

export const Loading = () => {
  return (
    <div className="loading">
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
