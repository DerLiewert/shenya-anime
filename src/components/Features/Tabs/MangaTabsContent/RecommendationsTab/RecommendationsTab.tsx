import { MangaRecommendationCard, RecommendationsTab } from '@/components';
import { mangaEmptyValueMessages } from '@/constants';
import { fetchMangaRecommendations } from '@/store';

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
