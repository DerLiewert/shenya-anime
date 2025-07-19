import React from 'react';
import { EntityTabItem } from '@/components/Common';
import { CharacterAnime } from '@/models';
import { characterEmptyValueMessages } from '@/variables';
import EntityTab from '../CommonTabsContent/EntityTab/EntityTab';

const CharacterAnimeTab: React.FC = () => {
  return (
    <EntityTab<CharacterAnime>
      status={(state) => state.characterFullById.status.item}
      emptyValueMessage={characterEmptyValueMessages.anime}
      selector={(state) => (state.characterFullById.item ? state.characterFullById.item.anime : [])}
      entityItem={(item, index) => {
        return (
          <EntityTabItem
            key={item.anime.mal_id}
            linkUrl={`/anime/${item.anime.mal_id}`}
            images={item.anime.images}
            title={item.anime.title}
            subtitles={[{ prefix: 'Role', text: item.role }]}
          />
        );
      }}
    />
  );
};

export default CharacterAnimeTab;
