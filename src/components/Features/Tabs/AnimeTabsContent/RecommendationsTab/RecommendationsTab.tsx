import React from 'react';
import { fetchAnimeRecommendations } from '@/store/anime/animeFullByIdSlice';

import { animeEmptyValueMessages } from '@/variables';
import { RecommendationsTab } from '../../CommonTabsContent';
import { AnimeRecommendationCard } from '@/components';
import './RecommendationsTab.scss';

const AnimeRecommendationsTab = () => {
  return (
    <RecommendationsTab
      selector={(state) => state.animeFullById.recommendations}
      status={(state) => state.animeFullById.status.recommendations}
      actionCreator={fetchAnimeRecommendations}
      entityItem={(item) => <AnimeRecommendationCard item={item.entry} key={item.entry.mal_id} />}
      emptyValueMessage={animeEmptyValueMessages.recommendations}
    />
  );
};

export default AnimeRecommendationsTab;
