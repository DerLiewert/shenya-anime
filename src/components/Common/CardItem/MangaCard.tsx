import { CardItem, MangaTooltip } from '@/components';
import { appPaths } from '@/resources';
import { isMangaNsfw } from '@/utils';
import { Manga } from '@/typescript';

interface MangaCardProps {
  item: Manga;
  tooltip?: boolean;
  className?: string;
}

export const MangaCard = ({ item, className, tooltip = true }: MangaCardProps) => {
  const renderCardItem = () => (
    <CardItem
      className={className}
      cardType="manga"
      item={{ ...item, year: item.published.prop.from.year }}
      linkPath={appPaths.mangaFull(item.mal_id)}
      nsfw={isMangaNsfw(item)}
    />
  );
  return tooltip ? <MangaTooltip item={item}>{renderCardItem()}</MangaTooltip> : renderCardItem();
};
