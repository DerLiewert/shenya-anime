import { EntitiesTab, EntityTabItem } from '@/components';
import { CharacterAnime } from '@/typescript';
import { characterEmptyValueMessages } from '@/constants';
import { appPaths } from '@/resources';

export const CharacterAnimeTab = () => {
  return (
    <EntitiesTab<CharacterAnime>
      status={(state) => state.characterFullById.status.item}
      emptyValueMessage={characterEmptyValueMessages.anime}
      selector={(state) => (state.characterFullById.item ? state.characterFullById.item.anime : [])}
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
              subtitles={[{ prefix: 'Role', text: item.role }]}
            />
          ))
      }
    />
  );
};
