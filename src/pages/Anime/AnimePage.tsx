import React from 'react';
import { Link } from 'react-router-dom';

import { getAnimePaths } from '@/utils';

import {
  AnimeCharacterTab,
  AnimeNewsTab,
  AnimePicturesTab,
  LongArrowIcon,
  AnimeRecommendationsTab,
  AnimeDetailsTab,
  AnimeEpisodesTab,
  AnimeStaffTab,
  AnimeVideosTab,
} from '@/components';

import { fetchFullAnimeById } from '@/store/anime/animeFullByIdSlice';
import { AnimeFull, JikanNamedResource } from '@/models';

import './AnimePage.scss';
import EntityPageLayout from '@/components/Layout/EntityPageLayout/EntityPageLayout';

const AnimePage = () => {
  return (
    <EntityPageLayout<AnimeFull>
      actionCreator={fetchFullAnimeById}
      selector={(state) => state.animeFullById.item}
      status={(state) => state.animeFullById.status.item}
      getBasePath={(id) => getAnimePaths(id).animeFull}
      render={(item) => ({
        title: item && item.title,
        subtitles: item
          ? [item.title_english, item.title_japanese].filter((str): str is string => Boolean(str))
          : [],
        resources: item && <AnimeResources item={item} />,
        trailer: item && item.trailer,
        breadcrumbs: item
          ? [
              { label: 'Top', url: '#' },
              { label: 'Anime', url: '#' },
              { label: item.title, url: '#' },
            ]
          : [],

        tabs: [
          {
            value: 'details',
            element: <AnimeDetailsTab />,
            children: [
              {
                value: 'staff',
                element: (
                  <>
                    <Link to=".." className="anime-tabs__back-link back-link">
                      <LongArrowIcon />
                      Back to Details
                    </Link>
                    <AnimeStaffTab />
                  </>
                ),
              },
            ],
          },
          {
            value: 'episodes',
            element: <AnimeEpisodesTab />,
          },
          {
            value: 'characters',
            element: <AnimeCharacterTab />,
          },
          {
            value: 'pictures',
            element: <AnimePicturesTab />,
          },
          {
            value: 'videos',
            element: <AnimeVideosTab />,
          },
          {
            value: 'news',
            element: <AnimeNewsTab />,
          },
          {
            value: 'recommendations',
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
