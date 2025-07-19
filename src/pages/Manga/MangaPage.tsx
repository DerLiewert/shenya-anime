import React from 'react';
import BG from '@/assets/manga-bg.jpeg';
import {
  EntityPageLayout,
  MangaCharacterTab,
  MangaNewsTab,
  MangaPicturesTab,
  MangaDetailsTab,
  MangaRecommendationsTab,
} from '@/components';
import { getMangaPaths } from '@/utils';
import { fetchFullMangaById } from '@/store/manga/mangaFullByIdSlice';
import { JikanNamedResource, Manga } from '@/models';
import './MangaPage.scss';

const MangaPage = () => {
  return (
    <EntityPageLayout<Manga>
      actionCreator={fetchFullMangaById}
      selector={(state) => state.mangaFullById.item}
      status={(state) => state.mangaFullById.status.item}
      getBasePath={(id) => getMangaPaths(id).mangaFull}
      introBg={BG}
      render={(item) => ({
        title: item && item.title,
        subtitles: item
          ? [item.title_english, item.title_japanese].filter((str): str is string => Boolean(str))
          : [],
        resources: item && <MangaResources item={item} />,
        breadcrumbs: item
          ? [
              { label: 'Top', url: '#' },
              { label: 'Manga', url: '#' },
              { label: item.title, url: '#' },
            ]
          : [],

        tabs: [
          {
            value: 'details',
            element: <MangaDetailsTab item={item} />,
          },
          {
            value: 'characters',
            element: <MangaCharacterTab />,
          },
          {
            value: 'pictures',
            element: <MangaPicturesTab />,
          },
          {
            value: 'news',
            element: <MangaNewsTab />,
          },
          {
            value: 'recommendations',
            element: <MangaRecommendationsTab />,
          },
          {
            value: 'more info',
            element: <div>more info</div>,
          },
        ],
      })}
    />
  );
};

export default MangaPage;

/* =====================
 === MangaResources ===
===================== */

type ResourcesList = {
  resources: JikanNamedResource[];
  title: string;
  emptyMessage: string;
};

const MangaResources: React.FC<{ item: Manga }> = ({ item }) => {
  const resources = item && item.external ? item.external : [];
  const official = resources.filter((obj) => obj.name === 'Official Site' || obj.name[0] === '@');
  const others = resources.filter((obj) => obj.name !== 'Official Site' && obj.name[0] !== '@');

  const renderResourcesList = ({ resources, title, emptyMessage }: ResourcesList) => (
    <div className="anime-leftside__item">
      <h4 className="anime-leftside__title">{title}</h4>
      <ul className="anime-leftside__list leftside-list">
        {resources.length > 0 ? (
          resources.map((resource) => (
            <li key={resource.url} className="leftside-list__item">
              <a
                href={resource.url}
                className="leftside-list__link"
                target="_blank"
                rel="noopener noreferrer">
                {resource.name}
              </a>
            </li>
          ))
        ) : (
          <li className="leftside-list__empry">{emptyMessage}</li>
        )}
      </ul>
    </div>
  );

  return (
    <div className="anime-leftside__resources">
      {renderResourcesList({
        resources: official,
        title: 'Available At',
        emptyMessage: 'Not Official Resources',
      })}
      {renderResourcesList({
        resources: others,
        title: 'Resources',
        emptyMessage: 'Not Other Resources',
      })}
    </div>
  );
};

/* =====================
 ======== Tabs ========
===================== */
export type TabRoute = {
  value: string;
  element: React.ReactNode;
  children?: TabRoute[];
};
