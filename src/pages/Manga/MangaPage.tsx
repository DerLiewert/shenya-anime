import React from 'react';
import BG from '@/assets/manga-bg.jpeg';
import { JikanNamedResource, MangaFull } from '@/models';
import {
  EntityPageLayout,
  MangaCharacterTab,
  MangaNewsTab,
  MangaPicturesTab,
  MangaDetailsTab,
  MangaRecommendationsTab,
} from '@/components';
import { fetchFullMangaById } from '@/store';
import { appPaths } from '@/resources';
import './MangaPage.scss';

const MangaPage = () => {
  return (
    <EntityPageLayout<MangaFull>
      fetchAction={fetchFullMangaById}
      selector={(state) => state.mangaFullById.item}
      status={(state) => state.mangaFullById.status.item}
      getBasePath={(id) => appPaths.mangaFull(id)}
      introBg={BG}
      render={(item) => ({
        title: item && item.title,
        subtitles: item
          ? [item.title_english, item.title_japanese].filter((str): str is string => Boolean(str))
          : [],
        resources: item && <MangaResources item={item} />,
        bookmark: 'manga',
        breadcrumbs: item
          ? [
              { label: 'Top', url: '#' },
              { label: 'Manga', url: '#' },
              ...(item.published.prop.from.year
                ? [{ label: item.published.prop.from.year, url: '#' }]
                : []),
              ...(item.type ? [{ label: item.type, url: '#' }] : []),
              { label: item.title, url: '#' },
            ]
          : [],

        tabs: [
          {
            value: 'details',
            label: 'Details',
            element: <MangaDetailsTab item={item} />,
          },
          {
            value: 'characters',
            label: 'Characters',
            element: <MangaCharacterTab />,
          },
          {
            value: 'pictures',
            label: 'Pictures',
            element: <MangaPicturesTab />,
          },
          {
            value: 'news',
            label: 'News',
            element: <MangaNewsTab />,
          },
          {
            value: 'recommendations',
            label: 'Recommendations',
            element: <MangaRecommendationsTab />,
          },
          {
            value: 'more-info',
            label: 'More info',
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

const MangaResources: React.FC<{ item: MangaFull }> = ({ item }) => {
  const resources = item && item.external ? item.external : [];
  const official = resources.filter((obj) => obj.name === 'Official Site' || obj.name[0] === '@');
  const others = resources.filter((obj) => obj.name !== 'Official Site' && obj.name[0] !== '@');

  const renderResourcesList = ({ resources, title, emptyMessage }: ResourcesList) => (
    <div className="anime-leftside__item">
      <h4 className="anime-leftside__title">{title}</h4>
      <ul className="anime-leftside__list leftside-list">
        {resources.length > 0 ? (
          resources.map((resource) => (
            <li key={resource.url} className="leftside-list__item leftside-list__item--icon">
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
          <li className="leftside-list__empty">{emptyMessage}</li>
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
