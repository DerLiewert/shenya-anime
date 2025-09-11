import React from 'react';
import { fetchAnimeNews } from '@/store/anime/animeFullByIdSlice';
import { NewsTab } from '../CommonTabsContent';

const AnimeNewsTab: React.FC = () => {
  return (
    <NewsTab
      newsSelector={(state) => state.animeFullById.news}
      status={(state) => state.animeFullById.status.news}
      fetchAction={fetchAnimeNews}
    />
  );
};

export default AnimeNewsTab;
