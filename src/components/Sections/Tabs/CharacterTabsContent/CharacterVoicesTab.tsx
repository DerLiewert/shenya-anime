import React from 'react';
import { CharacterVoiceActor } from '@/typescript';
import { EntityTab, EntityTabItem } from '@/components';
import { characterEmptyValueMessages } from '@/constants';

const CharacterVoicesTab: React.FC = () => {
  return (
    <EntityTab<CharacterVoiceActor>
      status={(state) => state.characterFullById.status.item}
      emptyValueMessage={characterEmptyValueMessages.voices}
      selector={(state) =>
        state.characterFullById.item ? state.characterFullById.item.voices : []
      }
      entityItem={(item, index) => {
        return (
          <EntityTabItem
            key={item.person.mal_id}
            linkUrl={`/people/${item.person.mal_id}`}
            images={item.person.images}
            title={item.person.name}
            subtitles={[{ prefix: 'Language', text: item.language }]}
          />
        );
      }}
    />
  );
};

export default CharacterVoicesTab;
