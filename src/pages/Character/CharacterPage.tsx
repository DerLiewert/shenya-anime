import React from 'react';
import BG from '@/assets/bg/character-bg.webp';
import {
  CharacterAnimeTab,
  CharacterMangaTab,
  CharacterPicturesTab,
  CharacterVoicesTab,
  CharacterAboutTab,
  EntityPageLayout,
} from '@/components';
import { CharacterFull } from '@/typescript';
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
      render={(item) => {
        const anime = item && item.anime[0] && item.anime[0].anime;
        const manga = item && item.manga[0] && item.manga[0].manga;
        return {
          title: item && item.name,
          subtitles: item && item.name_kanji ? [item.name_kanji] : [],
          resources: item && <AdditionalInfo item={item} />,
          breadcrumbs: item
            ? [
                ...(anime
                  ? [
                      {
                        label: 'Anime',
                        url: appPaths.anime,
                      },
                      {
                        label: anime.title,
                        url: appPaths.animeFull(anime.mal_id),
                      },
                    ]
                  : manga
                  ? [
                      {
                        label: 'Manga',
                        url: appPaths.manga,
                      },
                      {
                        label: manga.title,
                        url: appPaths.mangaFull(manga.mal_id),
                      },
                    ]
                  : []),
                {
                  label: 'Characters',
                  url: anime
                    ? appPaths.animeFull(anime.mal_id) + '/characters'
                    : manga
                    ? appPaths.mangaFull(manga.mal_id) + '/characters'
                    : '',
                },
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
        };
      }}
    />
  );
};

export default CharacterPage;

/* =====================
 === AdditionalInfo ===
===================== */

const AdditionalInfo: React.FC<{ item: CharacterFull }> = ({ item }) => {
  return (
    <div className="full-page-leftside__resources">
      <div className="full-page-leftside__item">
        <h4 className="full-page-leftside__title">Nicknames</h4>
        <ul className="full-page-leftside__list leftside-list">
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
