import React from 'react';
import { AnimeCharacter } from '@/models';
import { EntityTabItem, EntityTab } from '@/components';
import { animeEmptyValueMessages, specialStatus } from '@/constants';
import { fetchAnimeCharacters } from '@/store';
import { appPaths } from '@/resources';
import EntityTabx from '../CommonTabsContent/EntityTab/EntityTab copy';

const AnimeCharacterTab1: React.FC = () => {
  return (
    <EntityTab<AnimeCharacter>
      status={(state) => state.animeFullById.status.characters}
      emptyValueMessage={animeEmptyValueMessages.characters}
      selector={(state) => state.animeFullById.characters}
      fetchAction={fetchAnimeCharacters}
      entityItem={(item) => {
        return (
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
                  : specialStatus.unknown,
              },
            ]}
          />
        );
      }}
    />
  );
};

const AnimeCharacterTab: React.FC = () => {
  return (
    <EntityTabx<AnimeCharacter>
      status={(state) => state.animeFullById.status.characters}
      emptyValueMessage={animeEmptyValueMessages.characters}
      selector={(state) => state.animeFullById.characters}
      fetchAction={fetchAnimeCharacters}
      itemsBody={(options) => {
        return (
          <div className="entity-tab__items tab-grid-2">
            {options.items.slice(0, options.visibleCount).map((item) => {
              return (
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
                        : specialStatus.unknown,
                    },
                  ]}
                />
              );
            })}
          </div>
        );
      }}
    />
  );
};

export default AnimeCharacterTab;
