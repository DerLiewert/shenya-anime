import React from 'react';
import { formattedScore } from '@/utils';
import clsx from 'clsx';
import './Score.scss';

interface StatusProps {
  score: number | null;
  className?: string;
  isShadow?: boolean;
}

export const Score: React.FC<StatusProps> = ({ score, className, isShadow = false }) => {
  return (
    <span className={clsx(className, 'score', { 'score--shadow': isShadow })}>
      {formattedScore(score)}
    </span>
  );
};
