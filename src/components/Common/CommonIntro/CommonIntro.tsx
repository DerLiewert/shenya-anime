import React from 'react';
import './CommonIntro.scss';

type CommonIntroProps = {
  title: string;
  subtitle?: React.ReactNode;
  bgPrefix: 'anime' | 'manga' | 'schedules' | 'bookmark';
};

export const CommonIntro = ({ title, subtitle, bgPrefix }: CommonIntroProps) => {
  return (
    <section className={`common-intro common-intro--${bgPrefix}`}>
      <div className="container">
        <div className="common-intro__inner">
          <h2 className="common-intro__title title">{title}</h2>
          {subtitle && <div className="common-intro__sub-title">{subtitle}</div>}
        </div>
      </div>
    </section>
  );
};

