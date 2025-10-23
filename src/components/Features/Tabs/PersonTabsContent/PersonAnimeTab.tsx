import React from 'react';
import { PersonAnime } from '@/models';
import { EntityTabItem, EntityTab } from '@/components';
import { personEmptyValueMessages } from '@/constants';
import { appPaths } from '@/resources';

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
            linkUrl={appPaths.animeFull(item.anime.mal_id)}
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
