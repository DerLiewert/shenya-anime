import React from 'react';
import { fetchMangaNews } from '@/store/manga/mangaFullByIdSlice';
import { NewsTab } from '../CommonTabsContent';

const MangaNewsTab: React.FC = () => {
  return (
    <NewsTab
      newsSelector={(state) => state.mangaFullById.news}
      status={(state) => state.mangaFullById.status.news}
      fetchAction={fetchMangaNews}
    />
  );
};

export default MangaNewsTab;
