import React from 'react';
import { Link } from 'react-router-dom';
import { LongArrowIcon } from '@/components';
import clsx from 'clsx';
import './ReturnBack.scss';

interface ReturnBackProps {
  toLink?: string;
  textBackTo?: string;
  className?: string;
}

const ReturnBack: React.FC<ReturnBackProps> = ({ toLink, textBackTo, className }) => {
  return (
    <Link to={toLink ? toLink : '..'} className={clsx(className, 'back-link')}>
      <LongArrowIcon />
      Back {textBackTo && `to ${textBackTo}`}
    </Link>
  );
};

export default ReturnBack;
