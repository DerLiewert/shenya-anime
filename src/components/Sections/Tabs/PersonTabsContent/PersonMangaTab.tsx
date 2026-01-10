import { PersonManga } from '@/typescript';
import { EntitiesTab, EntityTabItem } from '@/components';
import { personEmptyValueMessages } from '@/constants';
import { appPaths } from '@/resources';

export const PersonMangaTab = () => {
  return (
    <EntitiesTab<PersonManga>
      status={(state) => state.personFullById.status.item}
      emptyValueMessage={personEmptyValueMessages.manga}
      selector={(state) => (state.personFullById.item ? state.personFullById.item.manga : [])}
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
              subtitles={[{ prefix: 'Position', text: item.position }]}
            />
          ))
      }
    />
  );
};
