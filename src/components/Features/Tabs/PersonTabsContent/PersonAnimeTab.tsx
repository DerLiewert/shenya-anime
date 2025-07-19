import React from 'react';
import { EntityTabItem } from '@/components/Common';
import { PersonAnime } from '@/models';
import { personEmptyValueMessages } from '@/variables';
import EntityTab from '../CommonTabsContent/EntityTab/EntityTab';

const PersonAnimeTab: React.FC = () => {
  return (
    <EntityTab<PersonAnime>
      status={(state) => state.personFullById.status.item}
      emptyValueMessage={personEmptyValueMessages.anime}
      selector={(state) => (state.personFullById.item ? state.personFullById.item.anime : [])}
      entityItem={(item, index) => {
        return (
          <EntityTabItem
            key={item.anime.mal_id}
            linkUrl={`/anime/${item.anime.mal_id}`}
            images={item.anime.images}
            title={item.anime.title}
            subtitles={[{ prefix: 'Position', text: item.position }]}
          />
        );
      }}
    />
  );
};

export default PersonAnimeTab;
