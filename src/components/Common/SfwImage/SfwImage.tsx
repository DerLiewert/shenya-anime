import { useAppSelector } from '@/app/hooks';
import clsx from 'clsx';
import React from 'react';
import './SfwImage.scss';

interface SfwImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  classWrapper?: string;
  nsfw: boolean;
  isContain?: boolean;
  isBgColorDark?: boolean;
  isBgClass?: boolean;
}

export const SfwImage = ({
  classWrapper,
  nsfw,
  isContain = false,
  isBgColorDark = false,
  isBgClass = false, 
  ...imgProps
}: SfwImageProps) => {
  const sfwOn = useAppSelector((state) => state.settings.sfw);
  return (
    <div
      className={clsx(classWrapper, 'sfw-image', { _nsfw: nsfw && sfwOn, _dark: isBgColorDark, bg: isBgClass })}>
      <img {...imgProps} className={clsx(imgProps.className, { _contain: isContain })} />
    </div>
  );
};
