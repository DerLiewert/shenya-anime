import { PersonVoices } from '@/typescript';
import { EntityTabItem, EntitiesTab } from '@/components';
import { personEmptyValueMessages } from '@/constants';
import { appPaths } from '@/resources';

export const PersonVoicesTab = () => {
  return (
    <EntitiesTab<PersonVoices>
      status={(state) => state.personFullById.status.item}
      emptyValueMessage={personEmptyValueMessages.voices}
      selector={(state) => (state.personFullById.item ? state.personFullById.item.voices : [])}
      itemsBodyClass="tab-grid-2"
      items={(options) =>
        options.items.slice(0, options.visibleCount).map((item) => (
          <EntityTabItem
            key={item.anime.mal_id + '_' + item.character.mal_id}
            linkUrl={appPaths.characterFull(item.character.mal_id)}
            images={item.character.images}
            title={item.character.name}
            subtitles={[
              { prefix: 'Anime', text: item.anime.title },
              { prefix: 'Role', text: item.role },
            ]}
          />
        ))
      }
    />
  );
};
