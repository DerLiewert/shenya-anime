import React from 'react';
import { AnimeTooltip, CardItem } from '@/components';
import { appPaths } from '@/resources';
import { Anime } from '@/models';

interface AnimeCardProps {
  item: Anime;
  className?: string;
  tooltip?: boolean;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ item, className, tooltip = true }) => {
  const { images, title, type, aired, status, score, mal_id } = item;
  const renderCardItem = () => (
    <CardItem
      className={className}
      linkPath={appPaths.animeFull(mal_id)}
      item={item}
      cardType="anime"
    />
  );
  return tooltip ? <AnimeTooltip item={item}>{renderCardItem()}</AnimeTooltip> : renderCardItem();
};

export default AnimeCard;
