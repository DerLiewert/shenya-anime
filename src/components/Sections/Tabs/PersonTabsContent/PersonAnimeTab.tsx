import { PersonAnime } from '@/typescript';
import { EntityTabItem, EntitiesTab } from '@/components';
import { personEmptyValueMessages } from '@/constants';
import { appPaths } from '@/resources';

export const PersonAnimeTab = () => {
  return (
    <EntitiesTab<PersonAnime>
      status={(state) => state.personFullById.status.item}
      emptyValueMessage={personEmptyValueMessages.anime}
      selector={(state) => (state.personFullById.item ? state.personFullById.item.anime : [])}
      itemsBodyClass="tab-grid-2"
      items={(options) =>
        options.items
          .slice(0, options.visibleCount)
          .map((item) => (
            <EntityTabItem
              key={item.anime.mal_id}
              linkUrl={appPaths.animeFull(item.anime.mal_id)}
              images={item.anime.images}
              title={item.anime.title}
              subtitles={[{ prefix: 'Position', text: item.position }]}
            />
          ))
      }
    />
  );
};
