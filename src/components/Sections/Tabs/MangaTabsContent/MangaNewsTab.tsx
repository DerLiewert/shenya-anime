import { fetchMangaNews } from '@/store/manga/mangaFullByIdSlice';
import { NewsTab } from '../CommonTabsContent';

export const MangaNewsTab = () => {
  return (
    <NewsTab
      newsSelector={(state) => state.mangaFullById.news}
      status={(state) => state.mangaFullById.status.news}
      fetchAction={fetchMangaNews}
    />
  );
};
