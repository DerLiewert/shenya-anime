import React from 'react';
import BG from '@/assets/bg/manga-bg.jpg';
import { JikanNamedResource, MangaFull } from '@/typescript';
import { fetchFullMangaById } from '@/store';
import { appPaths, mangaTypeOptions } from '@/resources';
import { isMangaNsfw } from '@/utils';
import {
  EntityPageLayout,
  MangaCharacterTab,
  MangaNewsTab,
  MangaPicturesTab,
  MangaRecommendationsTab,
  MangaDetailsTab,
} from '@/components';
import './MangaPage.scss';

const MangaPage = () => {
  return (
    <EntityPageLayout<MangaFull>
      isNsfw={(item) => (item ? isMangaNsfw(item) : false)}
      fetchAction={fetchFullMangaById}
      itemSelector={(state) => state.mangaFullById.item}
      itemStatusSelector={(state) => state.mangaFullById.status.item}
      createBasePath={(id) => appPaths.mangaFull(id)}
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
              { label: 'Top', url: appPaths.manga },
              ...(item.type
                ? [
                    {
                      label: item.type,
                      url: appPaths.mangaWithParams({
                        type: mangaTypeOptions.find((obj) => obj.label === item.type)?.value,
                      }),
                    },
                  ]
                : [{ label: 'Manga', url: appPaths.manga }]),
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
    <div className="full-page-leftside__item">
      <h4 className="full-page-leftside__title">{title}</h4>
      <ul className="full-page-leftside__list leftside-list">
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
    <div className="full-page-leftside__resources">
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
