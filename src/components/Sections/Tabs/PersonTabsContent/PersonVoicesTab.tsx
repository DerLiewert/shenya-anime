import React from 'react';
import { PersonVoices } from '@/typescript';
import { EntityTabItem, EntityTab } from '@/components';
import { personEmptyValueMessages } from '@/constants';
import { appPaths } from '@/resources';

const PersonVoicesTab: React.FC = () => {
  return (
    <EntityTab<PersonVoices>
      status={(state) => state.personFullById.status.item}
      emptyValueMessage={personEmptyValueMessages.voices}
      selector={(state) => (state.personFullById.item ? state.personFullById.item.voices : [])}
      entityItem={(item, index) => {
        return (
          <EntityTabItem
            key={item.anime.mal_id + '_' + item.character.mal_id}
            linkUrl={appPaths.characterFull(item.character.mal_id)}
            images={item.character.images}
            title={item.character.name}
            subtitles={[
              { prefix: 'Anime', text: item.anime.title },
              { prefix: 'Role', text: item.role },
            ]}
          />
        );
      }}
    />
  );
};

export default PersonVoicesTab;
