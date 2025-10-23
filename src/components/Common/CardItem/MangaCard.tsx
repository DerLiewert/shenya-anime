import React from 'react';
import { CardItem, MangaTooltip } from '@/components';
import { appPaths } from '@/resources';
import { Manga } from '@/models';

interface MangaCardProps {
  item: Manga;
  className?: string;
  tooltip?: boolean;
}

const MangaCard: React.FC<MangaCardProps> = ({ item, className, tooltip = true }) => {
  const { images, title, type, published, status, score, mal_id } = item;
  const renderCardItem = () => (
    <CardItem
      className={className}
      linkPath={appPaths.mangaFull(mal_id)}
      item={{...item, year: published.prop.from.year}}
      cardType="manga"
    />
  );
  return tooltip ? <MangaTooltip item={item}>{renderCardItem()}</MangaTooltip> : renderCardItem();
};

export default MangaCard;
