import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { LongArrowIcon } from '@/components';
import './SectionHeader.scss';

export interface SectionHeaderProps {
  title: string;
  link?: { url: string; text: string };
  className?: string;
}

export const SectionHeader = ({ title, link, className }: SectionHeaderProps) => {
  return (
    <div className={clsx(className, 'section-header')}>
      <h2 className="section-header__title title title--fz-36 title--main-color">{title}</h2>
      {link && (
        <Link to={link.url} className="section-header__link">
          {link.text}
          <LongArrowIcon />
        </Link>
      )}
    </div>
  );
};
