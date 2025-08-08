import React from 'react';
import { PersonFull } from '@/models';
import { splitText } from '@/utils';
import './AboutTab.scss';
import clsx from 'clsx';
import { EmptyValueMessage } from '@/components/UI';
import { personEmptyValueMessages } from '@/variables';

const AboutTab = ({ item }: { item: PersonFull }) => {
  return (
    <div className="about-tab">
      {item.about ? (
        splitText(item.about).map((str) => (
          <p className={clsx('about-tab__text', { _empty: str === '' })}>{str}</p>
        ))
      ) : (
        <EmptyValueMessage message={personEmptyValueMessages.synopsis} />
      )}
    </div>
  );
};

export default AboutTab;
