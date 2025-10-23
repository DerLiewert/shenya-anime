import { AnimeRecommendationCard, RecommendationsTab } from '@/components';
import { animeEmptyValueMessages } from '@/constants';
import { fetchAnimeRecommendations } from '@/store';

const AnimeRecommendationsTab = () => {
  return (
    <RecommendationsTab
      selector={(state) => state.animeFullById.recommendations}
      status={(state) => state.animeFullById.status.recommendations}
      fetchAction={fetchAnimeRecommendations}
      entityItem={(item) => <AnimeRecommendationCard item={item.entry} key={item.entry.mal_id} />}
      emptyValueMessage={animeEmptyValueMessages.recommendations}
    />
  );
};

export default AnimeRecommendationsTab;
