import React from 'react';
import { AnimeStaff } from '@/typescript';
import { EntityTab, EntityTabItem } from '@/components';
import { animeEmptyValueMessages } from '@/constants';
import { fetchAnimeStaff } from '@/store';
import { appPaths } from '@/resources';
import './StaffTab.scss';

const StaffTab: React.FC = () => {
  return (
    <EntityTab<AnimeStaff>
      status={(state) => state.animeFullById.status.staff}
      emptyValueMessage={animeEmptyValueMessages.staff}
      selector={(state) => state.animeFullById.staff}
      fetchAction={fetchAnimeStaff}
      visibleItemCount={18}
      entityItem={(item) => {
        return (
          <EntityTabItem
            key={item.person.mal_id}
            linkUrl={appPaths.personFull(item.person.mal_id)}
            images={item.person.images}
            title={item.person.name}
            subtitles={item.positions}
          />
        );
      }}
    />
  );
};

export default StaffTab;
