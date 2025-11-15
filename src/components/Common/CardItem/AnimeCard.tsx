import React from 'react';
import { AnimeTooltip, CardItem } from '@/components';
import { appPaths } from '@/resources';
import { Anime } from '@/models';
import { isAnimeNsfw } from '@/utils';

interface AnimeCardProps {
  item: Anime;
  className?: string;
  tooltip?: boolean;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ item, className, tooltip = true }) => {
  const renderCardItem = () => (
    <CardItem
      className={className}
      linkPath={appPaths.animeFull(item.mal_id)}
      item={item}
      cardType="anime"
      nsfw={isAnimeNsfw(item)}
    />
  );
  return tooltip ? <AnimeTooltip item={item}>{renderCardItem()}</AnimeTooltip> : renderCardItem();
};

export default AnimeCard;
