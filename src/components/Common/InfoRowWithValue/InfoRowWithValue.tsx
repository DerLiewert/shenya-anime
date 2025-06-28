import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import './InfoRowWithValue.scss';

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

// interface InfoValueProps {
//   name: string;
//   children: React.ReactNode;
//   isListItem?: boolean;
//   className?: string;
// }
// const InfoValue: React.FC<InfoValueProps> = ({
//   name,
//   children,
//   className = '',
// }) => {
//   return (
//     <p className={clsx(className, 'detail-item__value')}>{children}</p>
//   );
// };

// Два варианта пропсов

// interface CommonInfoValueProps {
//   className?: string;
//   children: React.ReactNode;
// }

// type AllowedTags = 'p' | 'a'; // Только разрешённые теги

// type InfoValueProps = {
//   as?: AllowedTags;
// } & CommonInfoValueProps & JSX.IntrinsicElements[AllowedTags];

// export const InfoValue = (props: InfoValueProps) => {
//   const { as, className, children, ...rest } = props;

//   const Tag = as || 'p';

//   return (
//     <Tag className={clsx('detail-item__value', className)} {...rest}>
//       {children}
//     </Tag>
//   );
// };

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

//========================================================================================================================================================

// interface OptionalLinkValueProps {
//   condition: string | null;
//   linkProps?: React.ComponentProps<'a'>;
//   fallbackProps?: React.ComponentProps<'p'>;
//   children: React.ReactNode;
// }

// export const OptionalLinkValue: React.FC<OptionalLinkValueProps> = ({
//   condition,
//   children,
//   linkProps = {},
//   fallbackProps = {},
// }) => {
//   if (condition) {
//     return (
//       <InfoValue isLink {...linkProps}>
//         {children}
//       </InfoValue>
//     );
//   }

//   return <InfoValue {...fallbackProps}>{children}</InfoValue>;
// };
