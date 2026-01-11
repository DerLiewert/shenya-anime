import React, { lazy } from 'react';
import { fetchFullAnimeById } from '@/store';
import { AnimeFull, JikanNamedResource } from '@/typescript';
import {
  AnimeCharacterTab,
  AnimeNewsTab,
  AnimePicturesTab,
  AnimeRecommendationsTab,
  AnimeDetailsTab,
  AnimeStaffTab,
  AnimeVideosTab,
  EntityPageLayout,
  ReturnBack,
  EpisodesTab,
} from '@/components';
import { appPaths, animeTypeOptions } from '@/resources';
import { isAnimeNsfw, toFirstUppercase } from '@/utils';
import './AnimePage.scss';

const AnimePage = () => {
  return (
    <EntityPageLayout<AnimeFull>
      isNsfw={(item) => (item ? isAnimeNsfw(item) : false)}
      fetchAction={fetchFullAnimeById}
      itemSelector={(state) => state.animeFullById.item}
      itemStatusSelector={(state) => state.animeFullById.status.item}
      createBasePath={(id) => appPaths.animeFull(id)}
      render={(item) => ({
        title: item && item.title,
        subtitles: item
          ? [item.title_english, item.title_japanese].filter((str): str is string => Boolean(str))
          : [],
        resources: item && <AnimeResources item={item} />,
        trailer: item && item.trailer,
        bookmark: 'anime',
        breadcrumbs: item
          ? [
              { label: 'Anime', url: appPaths.anime },
              ...(item.season && item.year
                ? [
                    {
                      label: toFirstUppercase(item.season),
                      url: appPaths.seasonalWithParams({ year: item.year, season: item.season }),
                    },
                    {
                      label: item.year,
                      url: appPaths.seasonalWithParams({ year: item.year, season: item.season }),
                    },
                  ]
                : []),
              ...(item.type
                ? [
                    {
                      label: item.type,
                      url: appPaths.animeWithParams({
                        type: animeTypeOptions.find((obj) => obj.label === item.type)?.value,
                      }),
                    },
                  ]
                : []),
              { label: item.title, url: '#' },
            ]
          : [],

        tabs: [
          {
            value: 'details',
            label: 'Details',
            element: <AnimeDetailsTab />,
            children: [
              {
                value: 'staff',
                label: 'Staff',
                element: (
                  <>
                    <ReturnBack textBackTo="Details" className="anime-tabs__back-link" />
                    <AnimeStaffTab />
                  </>
                ),
              },
            ],
          },
          {
            value: 'episodes',
            label: 'Episodes',
            element: <EpisodesTab />,
          },
          {
            value: 'characters',
            label: 'Characters',
            element: <AnimeCharacterTab />,
          },
          {
            value: 'pictures',
            label: 'Pictures',
            element: <AnimePicturesTab />,
          },
          {
            value: 'videos',
            label: 'Videos',
            element: <AnimeVideosTab />,
          },
          {
            value: 'news',
            label: 'News',
            element: <AnimeNewsTab />,
          },
          {
            value: 'recommendations',
            label: 'Recommendations',
            element: <AnimeRecommendationsTab />,
          },
        ],
      })}
    />
  );
};

export default AnimePage;

/* =====================
 === AnimeResources ===
===================== */

type ResourcesList = {
  resources: JikanNamedResource[];
  title: string;
  emptyMessage: string;
};

const AnimeResources: React.FC<{ item: AnimeFull }> = ({ item }) => {
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
    <div className="full-page-leftside__resources border-radius">
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
