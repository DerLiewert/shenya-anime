import { mangaEmptyValueMessages } from '@/variables';
import { fetchMangaRecommendations } from '@/store/manga/mangaFullByIdSlice';
import { MangaRecommendationCard, RecommendationsTab } from '@/components';
import './RecommendationsTab.scss';

const MangaRecommendationsTab = () => {
  return (
    <RecommendationsTab
      selector={(state) => state.mangaFullById.recommendations}
      status={(state) => state.mangaFullById.status.recommendations}
      fetchAction={fetchMangaRecommendations}
      entityItem={(item) => <MangaRecommendationCard item={item.entry} key={item.entry.mal_id} />}
      emptyValueMessage={mangaEmptyValueMessages.recommendations}
    />
  );
};

export default MangaRecommendationsTab;
