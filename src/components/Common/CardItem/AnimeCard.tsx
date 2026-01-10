import { AnimeTooltip, CardItem } from '@/components';
import { appPaths } from '@/resources';
import { isAnimeNsfw } from '@/utils';
import { Anime } from '@/typescript';

interface AnimeCardProps {
  item: Anime;
  tooltip?: boolean;
  className?: string;
}

export const AnimeCard = ({ item, className, tooltip = true }: AnimeCardProps) => {
  const renderCardItem = () => (
    <CardItem
      className={className}
      cardType='anime'
      item={item}
      linkPath={appPaths.animeFull(item.mal_id)}
      nsfw={isAnimeNsfw(item)}
    />
  );
  return tooltip ? <AnimeTooltip item={item}>{renderCardItem()}</AnimeTooltip> : renderCardItem();
};
