import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import './InfoRowWithValue.scss';

/* ======== InfoRow ======== */
interface InfoRowProps {
  name: string;
  children: React.ReactNode;
  // Tag?: keyof JSX.IntrinsicElements;
  Tag?: 'li' | 'div';
  className?: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({ name, children, Tag = 'li', className = '' }) => {
  return (
    <Tag className={clsx(className, 'info-row')}>
      <p className="info-row__name">{name}:</p>
      <div className="info-row__values">{children}</div>
    </Tag>
  );
};

/* ======== InfoValue ======== */
interface CommonInfoValueProps {
  children: React.ReactNode;
  className?: string;
}

type LinkProps = {
  isLink: true;
  to: string;
  isLinkPrimary?: boolean;
} & React.ComponentPropsWithoutRef<typeof Link>;

type TextProps = {
  isLink?: false;
  to?: never;
  isLinkPrimary?: never;
} & React.HTMLAttributes<HTMLParagraphElement>;

type InfoValueProps = CommonInfoValueProps & (LinkProps | TextProps);

export const InfoValue: React.FC<InfoValueProps> = (props) => {
  const { children, className, isLink = false, isLinkPrimary = false, ...rest } = props;
  const classes = clsx(className, 'info-row__value', {
    link: isLink,
    'link--primary': isLinkPrimary,
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
