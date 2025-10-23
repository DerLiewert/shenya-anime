import React from 'react';
import { CharacterFull } from '@/models';
import { splitText } from '@/utils';
import clsx from 'clsx';
import './AboutTab.scss';
import { EmptyValueMessage } from '@/components/UI';
import { characterEmptyValueMessages } from '@/constants';

const AboutTab = ({ item }: { item: CharacterFull }) => {
  return (
    <div className="about-tab">
      {item.about ? (
        splitText(item.about).map((str) => (
          <p className={clsx('about-tab__text', { _empty: str === '' })}>{str}</p>
        ))
      ) : (
        <EmptyValueMessage message={characterEmptyValueMessages.about} />
      )}
    </div>
  );
};

export default AboutTab;
