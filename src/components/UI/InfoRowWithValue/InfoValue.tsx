import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import './InfoRowWithValue.scss';

interface CommonInfoValueProps {
  children: React.ReactNode;
  className?: string;
  isPrimaryColor?: boolean;
}

type LinkProps = {
  isLink: true;
  to: string;
} & React.ComponentPropsWithoutRef<typeof Link>;

type TextProps = {
  isLink?: false;
  to?: never;
} & React.HTMLAttributes<HTMLParagraphElement>;

type InfoValueProps = CommonInfoValueProps & (LinkProps | TextProps);

export const InfoValue: React.FC<InfoValueProps> = (props) => {
  const { children, className, isLink = false, isPrimaryColor = false, ...rest } = props;
  const classes = clsx(className, 'info-row__value', {
    link: isLink,
    'link--primary': isPrimaryColor,
  });

  return isLink ? (
    <Link className={classes} {...(rest as React.ComponentPropsWithoutRef<typeof Link>)}>
      {children}
    </Link>
  ) : (
    <p className={classes} {...(rest as React.HTMLAttributes<HTMLParagraphElement>)}>
      {children}
    </p>
  );
};
