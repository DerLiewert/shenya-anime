import { AnimeCharacter } from '@/typescript';
import { EntityTabItem, EntitiesTab } from '@/components';
import { animeEmptyValueMessages, fallbackValues } from '@/constants';
import { fetchAnimeCharacters } from '@/store';
import { appPaths } from '@/resources';

export const AnimeCharacterTab = () => {
  return (
    <EntitiesTab<AnimeCharacter>
      status={(state) => state.animeFullById.status.characters}
      emptyValueMessage={animeEmptyValueMessages.characters}
      selector={(state) => state.animeFullById.characters}
      fetchAction={fetchAnimeCharacters}
      itemsBodyClass="tab-grid-2"
      items={(options) =>
        options.items.slice(0, options.visibleCount).map((item) => (
          <EntityTabItem
            key={item.character.mal_id}
            linkUrl={appPaths.characterFull(item.character.mal_id)}
            images={item.character.images}
            title={item.character.name}
            subtitles={[{ prefix: 'Role', text: item.role }]}
            bottomText={[
              {
                prefix: 'V/A',
                text: item.voice_actors[0]
                  ? item.voice_actors[0]?.person.name
                  : fallbackValues.unknown,
              },
            ]}
          />
        ))
      }
    />
  );
};
