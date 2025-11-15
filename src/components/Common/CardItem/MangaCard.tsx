import React from 'react';
import { CardItem, MangaTooltip } from '@/components';
import { appPaths } from '@/resources';
import { Manga } from '@/models';
import { isMangaNsfw } from '@/utils';

interface MangaCardProps {
  item: Manga;
  className?: string;
  tooltip?: boolean;
}

const MangaCard: React.FC<MangaCardProps> = ({ item, className, tooltip = true }) => {
  const renderCardItem = () => (
    <CardItem
      cardType="manga"
      className={className}
      linkPath={appPaths.mangaFull(item.mal_id)}
      item={{ ...item, year: item.published.prop.from.year }}
      nsfw={isMangaNsfw(item)}
    />
  );
  return tooltip ? <MangaTooltip item={item}>{renderCardItem()}</MangaTooltip> : renderCardItem();
};

export default MangaCard;
