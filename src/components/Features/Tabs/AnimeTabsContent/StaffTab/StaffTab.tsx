import React from 'react';
import { EntityTab, EntityTabItem } from '@/components';
import { AnimeStaff } from '@/models';
import { fetchAnimeStaff } from '@/store/anime/animeFullByIdSlice';
import { animeEmptyValueMessages } from '@/variables';
import './StaffTab.scss';

const StaffTab: React.FC = () => {
  return (
    <EntityTab<AnimeStaff>
      status={(state) => state.animeFullById.status.staff}
      emptyValueMessage={animeEmptyValueMessages.staff}
      selector={(state) => state.animeFullById.staff}
      actionCreator={fetchAnimeStaff}
      visibleItemCount={18}
      entityItem={(item, index) => {
        return (
          <EntityTabItem
            key={item.person.mal_id}
            linkUrl={`/people/${item.person.mal_id}`}
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
