import React from 'react';
import { fetchFullAnimeById } from '@/store/anime/animeFullByIdSlice';
import { AnimeFull, JikanNamedResource } from '@/models';
import {
  AnimeCharacterTab,
  AnimeNewsTab,
  AnimePicturesTab,
  AnimeRecommendationsTab,
  AnimeDetailsTab,
  AnimeEpisodesTab,
  AnimeStaffTab,
  AnimeVideosTab,
  EntityPageLayout,
  ReturnBack,
} from '@/components';
import { animePaths, animeTypeOptions } from '@/variables';
import './AnimePage.scss';
import { toFirstUppercase } from '@/utils';

const AnimePage = () => {
  return (
    <EntityPageLayout<AnimeFull>
      fetchAction={fetchFullAnimeById}
      selector={(state) => state.animeFullById.item}
      status={(state) => state.animeFullById.status.item}
      getBasePath={(id) => animePaths.full(id)}
      render={(item) => ({
        title: item && item.title,
        subtitles: item
          ? [item.title_english, item.title_japanese].filter((str): str is string => Boolean(str))
          : [],
        resources: item && <AnimeResources item={item} />,
        trailer: item && item.trailer,
        breadcrumbs: item
          ? [
              { label: 'Anime', url: animePaths.catalog },
              ...(item.season && item.year
                ? [
                    {
                      label: toFirstUppercase(item.season),
                      url: animePaths.seasonalWithParams({ year: item.year, season: item.season }),
                    },
                    {
                      label: item.year,
                      url: animePaths.seasonalWithParams({ year: item.year, season: item.season }),
                    },
                  ]
                : []),
              ...(item.type
                ? [
                    {
                      label: item.type,
                      url: animePaths.catalogWithParams({
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
            element: <AnimeEpisodesTab />,
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
    <div className="anime-leftside__resources border-radius">
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
