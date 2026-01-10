import { fetchAnimeNews } from '@/store';
import { NewsTab } from '../CommonTabsContent';

export const AnimeNewsTab = () => {
  return (
    <NewsTab
      newsSelector={(state) => state.animeFullById.news}
      status={(state) => state.animeFullById.status.news}
      fetchAction={fetchAnimeNews}
    />
  );
};
