import { LongArrowIcon } from '@/components/Icons';
import React from 'react';
import { Link } from 'react-router-dom';
import './SectionHeader.scss';

export interface ISectionHeaderProps {
  title: string;
  link?: {
    url: string;
    text: string;
  };
  className?: string;
}

const SectionHeader: React.FC<ISectionHeaderProps> = ({ className = '', title, link }) => {
  return (
    <div className={`${className} section-header`}>
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

export default SectionHeader;
