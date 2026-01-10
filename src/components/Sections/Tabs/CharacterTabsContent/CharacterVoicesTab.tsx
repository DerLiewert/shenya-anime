import { CharacterVoiceActor } from '@/typescript';
import { EntitiesTab, EntityTabItem } from '@/components';
import { characterEmptyValueMessages } from '@/constants';

export const CharacterVoicesTab = () => {
  return (
    <EntitiesTab<CharacterVoiceActor>
      status={(state) => state.characterFullById.status.item}
      emptyValueMessage={characterEmptyValueMessages.voices}
      selector={(state) =>
        state.characterFullById.item ? state.characterFullById.item.voices : []
      }
      itemsBodyClass="tab-grid-2"
      items={(options) =>
        options.items
          .slice(0, options.visibleCount)
          .map((item) => (
            <EntityTabItem
              key={item.person.mal_id}
              linkUrl={`/people/${item.person.mal_id}`}
              images={item.person.images}
              title={item.person.name}
              subtitles={[{ prefix: 'Language', text: item.language }]}
            />
          ))
      }
    />
  );
};
