import { useAppSelector } from '@/app/hooks';
import { AnimeRecommendationCard, RecommendationsTab } from '@/components';
import { animeEmptyValueMessages } from '@/constants';
import { fetchAnimeRecommendations } from '@/store';
import { isAnimeNsfw } from '@/utils';

const AnimeRecommendationsTab = () => {
  const currentAnime = useAppSelector((state) => state.animeFullById.item);
  return (
    <RecommendationsTab
      selector={(state) => state.animeFullById.recommendations}
      status={(state) => state.animeFullById.status.recommendations}
      fetchAction={fetchAnimeRecommendations}
      entityItem={(item) => (
        <AnimeRecommendationCard
          item={item.entry}
          key={item.entry.mal_id}
          nsfw={currentAnime ? isAnimeNsfw(currentAnime) : false}
        />
      )}
      emptyValueMessage={animeEmptyValueMessages.recommendations}
    />
  );
};

export default AnimeRecommendationsTab;
