import { useAppSelector } from '@/app/hooks';
import { MangaRecommendationCard, RecommendationsTab } from '@/components';
import { mangaEmptyValueMessages } from '@/constants';
import { fetchMangaRecommendations } from '@/store';
import { isMangaNsfw } from '@/utils';

const MangaRecommendationsTab = () => {
  const currentManga = useAppSelector((state) => state.mangaFullById.item);
  return (
    <RecommendationsTab
      selector={(state) => state.mangaFullById.recommendations}
      status={(state) => state.mangaFullById.status.recommendations}
      fetchAction={fetchMangaRecommendations}
      entityItem={(item) => (
        <MangaRecommendationCard
          item={item.entry}
          key={item.entry.mal_id}
          nsfw={currentManga ? isMangaNsfw(currentManga) : false}
        />
      )}
      emptyValueMessage={mangaEmptyValueMessages.recommendations}
    />
  );
};

export default MangaRecommendationsTab;
