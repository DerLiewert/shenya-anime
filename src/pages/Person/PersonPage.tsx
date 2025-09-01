import React from 'react';
import BG from '@/assets/people-bg.jpg';
import {
  PersonAnimeTab,
  PersonMangaTab,
  PersonPicturesTab,
  PersonVoicesTab,
  PersonAboutTab,
} from '@/components';
import { getPersonPaths } from '@/utils';
import { fetchPersonFullById } from '@/store/person/personFullByIdSlice';
import EntityPageLayout from '@/components/Layout/EntityPageLayout/EntityPageLayout';
import { PersonFull } from '@/models';
import './PersonPage.scss';

const PersonPage = () => {
  return (
    <EntityPageLayout<PersonFull>
      actionCreator={fetchPersonFullById}
      selector={(state) => state.personFullById.item}
      status={(state) => state.personFullById.status.item}
      getBasePath={(id) => getPersonPaths(id).personFull}
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
        breadcrumbs: item
          ? [
              { label: 'Top', url: '#' },
              { label: 'People', url: '#' },
              { label: item.name, url: '#' },
            ]
          : [],

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
    <div className="anime-leftside__resources">
      <div className="anime-leftside__item">
        <h4 className="anime-leftside__title">Other names</h4>
        <ul className="anime-leftside__list leftside-list">
          {item.alternate_names.length > 0 ? (
            item.alternate_names.map((name) => (
              <li key={name} className="leftside-list__item">
                {name}
              </li>
            ))
          ) : (
            <li className="leftside-list__empry">Not other names</li>
          )}
        </ul>
      </div>
    </div>
  );
};
