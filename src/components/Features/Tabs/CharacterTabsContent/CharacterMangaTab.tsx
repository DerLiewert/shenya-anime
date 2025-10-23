import React from 'react';
import { EntityTab, EntityTabItem } from '@/components';
import { CharacterManga } from '@/models';
import { characterEmptyValueMessages } from '@/constants';
import { appPaths } from '@/resources';

const CharacterMangaTab: React.FC = () => {
  return (
    <EntityTab<CharacterManga>
      status={(state) => state.characterFullById.status.item}
      emptyValueMessage={characterEmptyValueMessages.manga}
      selector={(state) => (state.characterFullById.item ? state.characterFullById.item.manga : [])}
      entityItem={(item, index) => {
        return (
          <EntityTabItem
            key={item.manga.mal_id}
            linkUrl={appPaths.mangaFull(item.manga.mal_id)}
            images={item.manga.images}
            title={item.manga.title}
            subtitles={[{ prefix: 'Role', text: item.role }]}
          />
        );
      }}
    />
  );
};

export default CharacterMangaTab;
