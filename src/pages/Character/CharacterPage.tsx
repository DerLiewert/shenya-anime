import React from 'react';
import BG from '@/assets/character-bg.webp';
import {
  CharacterAnimeTab,
  CharacterMangaTab,
  CharacterPicturesTab,
  CharacterVoicesTab,
  CharacterAboutTab,
  EntityPageLayout,
} from '@/components';
import { CharacterFull } from '@/models';
import { fetchCharacterFullById } from '@/store';
import { appPaths } from '@/resources';
import './CharacterPage.scss';

const CharacterPage = () => {
  return (
    <EntityPageLayout<CharacterFull>
      fetchAction={fetchCharacterFullById}
      selector={(state) => state.characterFullById.item}
      status={(state) => state.characterFullById.status.item}
      getBasePath={(id) => appPaths.characterFull(id)}
      introBg={BG}
      render={(item) => ({
        title: item && item.name,
        subtitles: item && item.name_kanji ? [item.name_kanji] : [],
        resources: item && <AdditionalInfo item={item} />,
        breadcrumbs: item
          ? [
              ...(item.anime[0]
                ? [{ label: item.anime[0].anime.title, url: '#' }]
                : item.manga[0]
                ? [{ label: item.manga[0].manga.title, url: '#' }]
                : []),
              { label: 'Character', url: '#' },
              { label: item.name, url: '#' },
            ]
          : [],

        tabs: item
          ? [
              {
                value: 'about',
                label: 'About',
                element: <CharacterAboutTab item={item} />,
              },
              {
                value: 'anime',
                label: 'Anime',
                element: <CharacterAnimeTab />,
              },
              {
                value: 'manga',
                label: 'Manga',
                element: <CharacterMangaTab />,
              },
              {
                value: 'voices',
                label: 'Voices',
                element: <CharacterVoicesTab />,
              },
              {
                value: 'pictures',
                label: 'Pictures',
                element: <CharacterPicturesTab />,
              },
            ]
          : [],
      })}
    />
  );
};

export default CharacterPage;

/* =====================
 === AdditionalInfo ===
===================== */

const AdditionalInfo: React.FC<{ item: CharacterFull }> = ({ item }) => {
  return (
    <div className="anime-leftside__resources">
      <div className="anime-leftside__item">
        <h4 className="anime-leftside__title">Nicknames</h4>
        <ul className="anime-leftside__list leftside-list">
          {item.nicknames.length > 0 ? (
            item.nicknames.map((nickname) => (
              <li key={nickname} className="leftside-list__item">
                {nickname}
              </li>
            ))
          ) : (
            <li className="leftside-list__empty">Not any nicknames</li>
          )}
        </ul>
      </div>
    </div>
  );
};
