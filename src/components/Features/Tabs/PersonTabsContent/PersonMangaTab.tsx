import React from 'react';
import { PersonManga } from '@/models';
import { personEmptyValueMessages } from '@/variables';
import { EntityTabItem, EntityTab } from '@/components';

const PersonMangaTab: React.FC = () => {
  return (
    <EntityTab<PersonManga>
      status={(state) => state.personFullById.status.item}
      emptyValueMessage={personEmptyValueMessages.manga}
      selector={(state) => (state.personFullById.item ? state.personFullById.item.manga : [])}
      entityItem={(item, index) => {
        return (
          <EntityTabItem
            key={item.manga.mal_id}
            linkUrl={`/manga/${item.manga.mal_id}`}
            images={item.manga.images}
            title={item.manga.title}
            subtitles={[{ prefix: 'Position', text: item.position }]}
          />
        );
      }}
    />
  );
};

export default PersonMangaTab;
