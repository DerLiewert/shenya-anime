import React from 'react';
import BG from '@/assets/bg/people-bg.jpg';
import {
  PersonAnimeTab,
  PersonMangaTab,
  PersonPicturesTab,
  PersonVoicesTab,
  PersonAboutTab,
  EntityPageLayout,
} from '@/components';
import { PersonFull } from '@/typescript';
import { appPaths } from '@/resources';
import { fetchPersonFullById } from '@/store';
import './PersonPage.scss';

const PersonPage = () => {
  return (
    <EntityPageLayout<PersonFull>
      fetchAction={fetchPersonFullById}
      selector={(state) => state.personFullById.item}
      status={(state) => state.personFullById.status.item}
      getBasePath={(id) => appPaths.personFull(id)}
      introBg={BG}
      render={(item) => ({
        title: item && item.name,
        subtitles: item
          ? [
              `${item.given_name ? item.given_name : ''} ${
                item.family_name ? item.family_name : ''
              }`,
            ].filter((str) => Boolean(str.trim()))
          : [],
        resources: item && <AdditionalInfo item={item} />,
        // breadcrumbs: item
        //   ? [
        //       { label: 'Top', url: '#' },
        //       { label: 'People', url: '#' },
        //       { label: item.name, url: '#' },
        //     ]
        //   : [],

        tabs: item
          ? [
              {
                value: 'about',
                label: 'About',
                element: <PersonAboutTab item={item} />,
              },
              {
                value: 'anime',
                label: 'Anime',
                element: <PersonAnimeTab />,
              },
              {
                value: 'manga',
                label: 'Manga',
                element: <PersonMangaTab />,
              },
              {
                value: 'voices',
                label: 'Voices',
                element: <PersonVoicesTab />,
              },
              {
                value: 'pictures',
                label: 'Pictures',
                element: <PersonPicturesTab />,
              },
            ]
          : [],
      })}
    />
  );
};
export default PersonPage;

/* =====================
 === AdditionalInfo ===
===================== */

const AdditionalInfo: React.FC<{ item: PersonFull }> = ({ item }) => {
  return (
    <div className="full-page-leftside__resources">
      <div className="full-page-leftside__item">
        <h4 className="full-page-leftside__title">Alternative names</h4>
        <ul className="full-page-leftside__list leftside-list">
          {item.alternate_names.length > 0 ? (
            item.alternate_names.map((name) => (
              <li key={name} className="leftside-list__item">
                {name}
              </li>
            ))
          ) : (
            <li className="leftside-list__empty">No alternative names</li>
          )}
        </ul>
      </div>
    </div>
  );
};
