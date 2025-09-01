import React from 'react';
import { PersonFull } from '@/models';
import { splitText } from '@/utils';
import { EmptyValueMessage } from '@/components/UI';
import { personEmptyValueMessages } from '@/variables';
import clsx from 'clsx';
import './AboutTab.scss';

const AboutTab = ({ item }: { item: PersonFull }) => {
  if (!item.birthday && !item.website_url && !item.about)
    return <EmptyValueMessage message={personEmptyValueMessages.about} />;

  return (
    <div className="about-tab">
      {item.birthday && (
        <p className={clsx('about-tab__text')}>Birthday: {item.birthday.split('T')[0]}</p>
      )}
      {item.website_url && (
        <p className={clsx('about-tab__text')}>
          Website:{' '}
          <a href={item.website_url} target="_blank" rel="noopener noreferrer">
            {item.website_url}
          </a>
        </p>
      )}
      {item.about &&
        splitText(item.about).map((str) => (
          <p className={clsx('about-tab__text', { _empty: str === '' })}>{str}</p>
        ))}
    </div>
  );
};

export default AboutTab;
