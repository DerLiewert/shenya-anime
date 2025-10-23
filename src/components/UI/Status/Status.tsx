import React from 'react';
import { AnimeStatus, MangaStatus } from '@/models';
import { getStatusClassName, valueOrDefault } from '@/utils';
import clsx from 'clsx';
import './Status.scss';

interface StatusProps {
  status: AnimeStatus | MangaStatus | null;
  className?: string;
  isShadow?: boolean;
}

export const Status: React.FC<StatusProps> = ({ status, className, isShadow = false }) => {
  const statusClassName = getStatusClassName(status);
  const classes = clsx(className, 'status', statusClassName, { 'status--shadow': isShadow });
  return <span className={classes}>{valueOrDefault(status)}</span>;
};
