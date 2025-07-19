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
          ? [item.given_name + ' ' + item.family_name].filter((str): str is string =>
              Boolean(str.trim()),
            )
          : [],
        // resources: item && <AdditionalInfo item={item} />,
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
                element: <PersonAboutTab item={item} />,
              },
              {
                value: 'anime',
                element: <PersonAnimeTab />,
              },
              {
                value: 'manga',
                element: <PersonMangaTab />,
              },
              {
                value: 'voices',
                element: <PersonVoicesTab />,
              },
              {
                value: 'pictures',
                element: <PersonPicturesTab />,
              },
            ]
          : [],
      })}
    />
  );
};
export default PersonPage;
