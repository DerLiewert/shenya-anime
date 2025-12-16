import React from 'react';
import { PersonFull } from '@/typescript';
import { splitText } from '@/utils';
import { EmptyValueMessage } from '@/components';
import { personEmptyValueMessages } from '@/constants';
import clsx from 'clsx';
import './AboutTab.scss';

const AboutTab = ({ item }: { item: PersonFull }) => {
  if (!item.birthday && !item.website_url && !item.about)
    return <EmptyValueMessage message={personEmptyValueMessages.about} />;

  return (
    <div className="about-person">
      {item.birthday && (
        <p className="about-person__text">Birthday: {item.birthday.split('T')[0]}</p>
      )}
      {item.website_url && (
        <p className="about-person__text">
          Website:{' '}
          <a href={item.website_url} target="_blank" rel="noopener noreferrer">
            {item.website_url}
          </a>
        </p>
      )}
      {item.about &&
        splitText(item.about).map((str) => (
          <p className={clsx('about-person__text', { _empty: str === '' })}>{str}</p>
        ))}
    </div>
  );
};

export default AboutTab;
