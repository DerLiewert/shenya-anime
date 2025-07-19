import React from 'react';
import { PersonVoices } from '@/models';
import { personEmptyValueMessages } from '@/variables';
import { EntityTabItem } from '@/components';
import { EntityTab } from '../CommonTabsContent';

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
            linkUrl={`/character/${item.character.mal_id}`}
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
