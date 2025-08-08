import React from 'react';
import { mangaEmptyValueMessages } from '@/variables';
import { fetchMangaRecommendations } from '@/store/manga/mangaFullByIdSlice';
import { RecommendationsTab } from '../../CommonTabsContent';
import { MangaRecommendationCard } from '@/components/Common';
import './RecommendationsTab.scss';

const MangaRecommendationsTab = () => {
  return (
    <RecommendationsTab
      selector={(state) => state.mangaFullById.recommendations}
      status={(state) => state.mangaFullById.status.recommendations}
      actionCreator={fetchMangaRecommendations}
      entityItem={(item => <MangaRecommendationCard item={item.entry} key={item.entry.mal_id}/>)}
      emptyValueMessage={mangaEmptyValueMessages.recommendations}
    />
  );
};

export default MangaRecommendationsTab;
