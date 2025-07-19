import React from 'react';
import { EntityTabItem } from '@/components/Common';
import { AnimeCharacter } from '@/models';
import { fetchAnimeCharacters } from '@/store/anime/animeFullByIdSlice';
import { animeEmptyValueMessages, SpecialStatus } from '@/variables';
import EntityTab from '../CommonTabsContent/EntityTab/EntityTab';

const AnimeCharacterTab: React.FC = () => {
  return (
    <EntityTab<AnimeCharacter>
      status={(state) => state.animeFullById.status.characters}
      emptyValueMessage={animeEmptyValueMessages.characters}
      selector={(state) => state.animeFullById.characters}
      actionCreator={fetchAnimeCharacters}
      entityItem={(item, index) => {
        return (
          <EntityTabItem
            key={item.character.mal_id}
            linkUrl={`/character/${item.character.mal_id}`}
            images={item.character.images}
            title={item.character.name}
            subtitles={[{ prefix: 'Role', text: item.role }]}
            bottomText={[
              {
                prefix: 'V/A',
                text: item.voice_actors[0]
                  ? item.voice_actors[0]?.person.name
                  : SpecialStatus.Unknown,
              },
            ]}
          />
        );
      }}
    />
  );
};

export default AnimeCharacterTab;
