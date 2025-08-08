import React from 'react';
import { AnimeStatus, MangaStatus } from '@/models';
import { getAnimeStatusClassName, valueOrDefault } from '@/utils';
import clsx from 'clsx';

interface StatusProps {
  status: AnimeStatus | MangaStatus | null;
  className?: string;
  isShadow?: boolean;
}

export const Status: React.FC<StatusProps> = ({ status, className = '', isShadow = false }) => {
  const statusClassName = getAnimeStatusClassName(status);
  const classes = clsx('status', className, { 'status--shadow': isShadow }, statusClassName);

  return <span className={classes}>{valueOrDefault(status)}</span>;
};
