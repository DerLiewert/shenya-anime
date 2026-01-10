import clsx from 'clsx';
import { CharacterFull } from '@/typescript';
import { characterEmptyValueMessages } from '@/constants';
import { splitText } from '@/utils';
import { EmptyValueMessage } from '@/components';
import './CharacterAboutTab.scss';

export const CharacterAboutTab = ({ item }: { item: CharacterFull }) => {
  return (
    <div className="character-about-tab">
      {item.about ? (
        splitText(item.about).map((str, index) => (
          <p className={clsx('character-about-tab__text', { _empty: str === '' })} key={index}>
            {str}
          </p>
        ))
      ) : (
        <EmptyValueMessage message={characterEmptyValueMessages.about} />
      )}
    </div>
  );
};
