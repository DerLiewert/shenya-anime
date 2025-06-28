import React from 'react';
import clsx from 'clsx';
import { AnimeStatus } from '../../models';
import { getAnimeStatusClassName, valueOrDefault } from '../../utils';

interface StatusProps {
  status: AnimeStatus | null;
  className?: string;
  isShadow?: boolean;
}

export const Status: React.FC<StatusProps> = ({ status, className = '', isShadow = false }) => {
  const statusClassName = getAnimeStatusClassName(status);
  const classes = clsx('status', className, { 'status--shadow': isShadow }, statusClassName);

  return <span className={classes}>{valueOrDefault(status)}</span>;
};
