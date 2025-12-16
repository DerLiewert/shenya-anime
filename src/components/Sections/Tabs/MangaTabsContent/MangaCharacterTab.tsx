import React from 'react';
import { CommonCharacter } from '@/typescript';
import { EntityTab, EntityTabItem } from '@/components';
import { mangaEmptyValueMessages } from '@/constants';
import { fetchMangaCharacters } from '@/store';
import { appPaths } from '@/resources';

const MangaCharacterTab: React.FC = () => {
  return (
    <EntityTab<CommonCharacter>
      status={(state) => state.mangaFullById.status.characters}
      selector={(state) => state.mangaFullById.characters}
      fetchAction={fetchMangaCharacters}
      emptyValueMessage={mangaEmptyValueMessages.characters}
      entityItem={(item, index) => {
        return (
          <EntityTabItem
            key={item.character.mal_id}
            linkUrl={appPaths.characterFull(item.character.mal_id)}
            images={item.character.images}
            title={item.character.name}
            subtitles={[{ prefix: 'Role', text: item.role }]}
          />
        );
      }}
    />
  );
};

export default MangaCharacterTab;
