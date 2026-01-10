import { EntitiesTab, EntityTabItem } from '@/components';
import { CharacterManga } from '@/typescript';
import { characterEmptyValueMessages } from '@/constants';
import { appPaths } from '@/resources';

export const CharacterMangaTab = () => {
  return (
    <EntitiesTab<CharacterManga>
      status={(state) => state.characterFullById.status.item}
      emptyValueMessage={characterEmptyValueMessages.manga}
      selector={(state) => (state.characterFullById.item ? state.characterFullById.item.manga : [])}
      itemsBodyClass="tab-grid-2"
      items={(options) =>
        options.items
          .slice(0, options.visibleCount)
          .map((item) => (
            <EntityTabItem
              key={item.manga.mal_id}
              linkUrl={appPaths.mangaFull(item.manga.mal_id)}
              images={item.manga.images}
              title={item.manga.title}
              subtitles={[{ prefix: 'Role', text: item.role }]}
            />
          ))
      }
    />
  );
};