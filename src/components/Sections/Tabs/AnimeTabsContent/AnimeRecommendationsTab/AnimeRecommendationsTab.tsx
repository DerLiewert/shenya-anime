import { useAppSelector } from '@/app/hooks';
import { AnimeRecommendationCard, EntitiesTab } from '@/components';
import { animeEmptyValueMessages } from '@/constants';
import { fetchAnimeRecommendations } from '@/store';
import { isAnimeNsfw } from '@/utils';
import './AnimeRecommendationsTab.scss';

export const AnimeRecommendationsTab = () => {
  const currentAnime = useAppSelector((state) => state.animeFullById.item);
  return (
    <EntitiesTab
      selector={(state) => state.animeFullById.recommendations}
      status={(state) => state.animeFullById.status.recommendations}
      fetchAction={fetchAnimeRecommendations}
      emptyValueMessage={animeEmptyValueMessages.recommendations}
      itemsBodyClass="anime-recommendations-tab"
      items={(options) =>
        options.items
          .slice(0, options.visibleCount)
          .map((item) => (
            <AnimeRecommendationCard
              item={item.entry}
              key={item.entry.mal_id}
              nsfw={currentAnime ? isAnimeNsfw(currentAnime) : false}
            />
          ))
      }
    />
  );
};
