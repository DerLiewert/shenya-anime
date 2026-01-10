import { ProducerFull } from '@/typescript';
import { EmptyValueMessage } from '@/components';
import { producerEmptyValueMessages } from '@/constants';
import './ProducerAboutTab.scss';

export const ProducerAboutTab = ({ item }: { item: ProducerFull }) => {
  if (!item.established || !item.about)
    return <EmptyValueMessage message={producerEmptyValueMessages.about} />;

  return (
    <div className="about-producer">
      <p className="about-producer__text">Established: {item.established.split('T')[0]}</p>
      <p className="about-producer__text about-producer__text_empty"></p>
      <p className="about-producer__text">{item.about}</p>
    </div>
  );
};
