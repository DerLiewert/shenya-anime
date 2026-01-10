import { CommonCharacter } from '@/typescript';
import { EntitiesTab, EntityTabItem } from '@/components';
import { mangaEmptyValueMessages } from '@/constants';
import { fetchMangaCharacters } from '@/store';
import { appPaths } from '@/resources';

export const MangaCharacterTab = () => {
  return (
    <EntitiesTab<CommonCharacter>
      status={(state) => state.mangaFullById.status.characters}
      selector={(state) => state.mangaFullById.characters}
      fetchAction={fetchMangaCharacters}
      emptyValueMessage={mangaEmptyValueMessages.characters}
      itemsBodyClass="tab-grid-2"
      items={(options) =>
        options.items
          .slice(0, options.visibleCount)
          .map((item) => (
            <EntityTabItem
              key={item.character.mal_id}
              linkUrl={appPaths.characterFull(item.character.mal_id)}
              images={item.character.images}
              title={item.character.name}
              subtitles={[{ prefix: 'Role', text: item.role }]}
            />
          ))
      }
    />
  );
};
