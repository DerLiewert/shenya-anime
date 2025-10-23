import React from 'react';
import { ProducerFull } from '@/models';
import { EmptyValueMessage } from '@/components';
import { producerEmptyValueMessages } from '@/constants';
import './AboutTab.scss';

const AboutTab = ({ item }: { item: ProducerFull }) => {
  if (!item.established || !item.about)
    return <EmptyValueMessage message={producerEmptyValueMessages.about} />;

  return (
    <div className="about-tab">
      <p className="about-tab__text">Established: {item.established.split('T')[0]}</p>
      <p className="about-tab__text about-tab__text_empty"></p>
      <p className="about-tab__text">{item.about}</p>
    </div>
  );
};

export default AboutTab;
