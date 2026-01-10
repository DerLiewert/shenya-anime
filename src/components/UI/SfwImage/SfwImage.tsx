import React from 'react';
import { useAppSelector } from '@/app/hooks';
import clsx from 'clsx';
import './SfwImage.scss';

interface SfwImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  nsfw: boolean;
  isImgContain?: boolean;
  isBgColorDark?: boolean;
  isBgClass?: boolean;
  classWrapper?: string;
}

export const SfwImage = ({
  classWrapper,
  nsfw,
  isImgContain = false,
  isBgColorDark = false,
  isBgClass = false,
  ...imgProps
}: SfwImageProps) => {
  const sfwOn = useAppSelector((state) => state.settings.sfw);
  return (
    <div
      className={clsx(classWrapper, 'sfw-image', {
        _nsfw: nsfw && sfwOn,
        _dark: isBgColorDark,
        bg: isBgClass,
      })}>
      <img {...imgProps} className={clsx(imgProps.className, { _contain: isImgContain })} />
    </div>
  );
};
