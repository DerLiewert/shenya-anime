import React from 'react';
import clsx from 'clsx';
import { formattedScore } from '../../utils';
import { Anime } from '../../models';

interface StatusProps {
  score: Anime['score'];
  className?: string;
  isShadow?: boolean;
}

export const Score: React.FC<StatusProps> = ({ score, className = '', isShadow = false }) => {
  return (
    <span className={clsx(className, 'score', { 'score--shadow': isShadow })}>
      {formattedScore(score)}
    </span>
  );
};
