import React from 'react';
import BG from '@/assets/people-bg.jpg';
import {
  PersonAnimeTab,
  PersonMangaTab,
  PersonPicturesTab,
  PersonVoicesTab,
  PersonAboutTab,
  InfoRow,
  InfoValue,
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

/* =====================
 === AdditionalInfo ===
===================== */

const AdditionalInfo: React.FC<{ item: PersonFull }> = ({ item }) => {
  const isAdditional = item.alternate_names.length > 0 || item.birthday || item.website_url;
  return (
    <div className="additional-info border-radius">
      <h4 className="anime-leftside__title">Additional details</h4>
      {isAdditional ? (
        <ul className="anime-leftside__list leftside-list">
          {item.alternate_names.length > 0 && (
            <InfoRow name="Other names" className="additional-info__row">
              {item.alternate_names.map((name) => (
                <InfoValue>{name}</InfoValue>
              ))}
            </InfoRow>
          )}
          <InfoRow name="Birthday" className="additional-info__row">
            <InfoValue>{item.birthday ? item.birthday.split('T')[0] : 'Unknown'}</InfoValue>
          </InfoRow>
          {item.website_url && (
            <InfoRow name="Website" className="additional-info__row">
              <InfoValue className="visible-line visible-line--1">
                <a href={item.website_url}>{item.website_url}</a>
              </InfoValue>
            </InfoRow>
          )}

          {/* <InfoRow name="Other names" className="additional-info__row">
          {item.alternate_names.length > 0 ? (
            item.alternate_names.map((name) => <InfoValue>{name}</InfoValue>)
          ) : (
            <InfoValue>Unknown</InfoValue>
          )}
        </InfoRow>
        <InfoRow name="Birthday" className="additional-info__row">
          <InfoValue>{item.birthday ? item.birthday.split('T')[0] : 'Unknown'}</InfoValue>
        </InfoRow>
        <InfoRow name="Website" className="additional-info__row">
          <InfoValue className="visible-line visible-line--1">
            {item.website_url ? <a href={item.website_url}>{item.website_url}</a> : 'Unknown'}
          </InfoValue>
        </InfoRow> */}
        </ul>
      ) : (
        'no info'
      )}
    </div>
  );
};
