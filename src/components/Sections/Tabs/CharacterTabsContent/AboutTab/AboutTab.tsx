import React from 'react';
import { CharacterFull } from '@/typescript';
import { splitText } from '@/utils';
import clsx from 'clsx';
import './AboutTab.scss';
import { EmptyValueMessage } from '@/components/UI';
import { characterEmptyValueMessages } from '@/constants';

const AboutTab = ({ item }: { item: CharacterFull }) => {
  return (
    <div className="about-tab">
      {item.about ? (
        splitText(item.about).map((str, index) => (
          <p className={clsx('about-tab__text', { _empty: str === '' })} key={index}>
            {str}
          </p>
        ))
      ) : (
        <EmptyValueMessage message={characterEmptyValueMessages.about} />
      )}
    </div>
  );
};

export default AboutTab;
