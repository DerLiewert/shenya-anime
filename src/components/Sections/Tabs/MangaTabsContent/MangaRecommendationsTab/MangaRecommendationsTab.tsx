import { useAppSelector } from '@/app/hooks';
import { EntitiesTab, MangaRecommendationCard } from '@/components';
import { mangaEmptyValueMessages } from '@/constants';
import { fetchMangaRecommendations } from '@/store';
import { isMangaNsfw } from '@/utils';
import './MangaRecommendationsTab.scss';

export const MangaRecommendationsTab = () => {
  const currentManga = useAppSelector((state) => state.mangaFullById.item);
  return (
    <EntitiesTab
      selector={(state) => state.mangaFullById.recommendations}
      status={(state) => state.mangaFullById.status.recommendations}
      fetchAction={fetchMangaRecommendations}
      emptyValueMessage={mangaEmptyValueMessages.recommendations}
      itemsBodyClass="manga-recommendations-tab"
      items={(options) =>
        options.items
          .slice(0, options.visibleCount)
          .map((item) => (
            <MangaRecommendationCard
              item={item.entry}
              key={item.entry.mal_id}
              nsfw={currentManga ? isMangaNsfw(currentManga) : false}
            />
          ))
      }
    />
  );
};
