import React from 'react';
import clsx from 'clsx';
import { AnimeStatus, MangaStatus } from '@/typescript';
import { getStatusClassName, valueOrDefault } from '@/utils';
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
