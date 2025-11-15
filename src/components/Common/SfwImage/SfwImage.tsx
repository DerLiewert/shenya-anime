import { useAppSelector } from '@/app/hooks';
import clsx from 'clsx';
import React from 'react';
import './SfwImage.scss';

interface SfwImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  classWrapper?: string;
  classImage?: string;
  nsfw: boolean;
}

export const SfwImage = ({ classWrapper, classImage, nsfw, ...imgProps }: SfwImageProps) => {
  const sfwOn = useAppSelector((state) => state.settings.sfw);
  return (
    <div className={clsx('img', classWrapper, { 'nsfw-img': nsfw && sfwOn })}>
      <img className={clsx(classImage, { nsfw: nsfw && sfwOn })} {...imgProps} />
    </div>
  );
};
