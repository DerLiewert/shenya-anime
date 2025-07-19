import React from 'react';
import { EntityTabItem } from '@/components/Common';
import { CommonCharacter } from '@/models';
import { mangaEmptyValueMessages } from '@/variables';
import EntityTab from '../CommonTabsContent/EntityTab/EntityTab';
import { fetchMangaCharacters } from '@/store/manga/mangaFullByIdSlice';

const MangaCharacterTab: React.FC = () => {
  return (
    <EntityTab<CommonCharacter>
      status={(state) => state.mangaFullById.status.characters}
      selector={(state) => state.mangaFullById.characters}
      actionCreator={fetchMangaCharacters}
      emptyValueMessage={mangaEmptyValueMessages.characters}
      entityItem={(item, index) => {
        return (
          <EntityTabItem
            key={item.character.mal_id}
            linkUrl={`/character/${item.character.mal_id}`}
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
