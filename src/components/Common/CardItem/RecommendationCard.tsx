import React from 'react';
import { Link } from 'react-router-dom';
import { AnimeTooltip, MangaTooltip, SfwImage } from '@/components';
import { getImageUrl } from '@/utils';
import { appPaths } from '@/resources';
import { RecommendationEntry } from '@/typescript';
import clsx from 'clsx';
import './CardItem.scss';

interface RecommendationCard {
  item: RecommendationEntry;
  linkPath: string;
  nsfw?: boolean;
  className?: string;
}

export const RecommendationCard = React.forwardRef<HTMLAnchorElement, RecommendationCard>(
  ({ item, linkPath, nsfw = false, className }, ref) => {
    const { images, title } = item;
    return (
      <Link to={linkPath} ref={ref} className={clsx(className, 'card-item border-opacity')}>
        <SfwImage
          classWrapper="card-item__image-block border-radius"
          src={getImageUrl(images)}
          alt="Poster"
          loading="lazy"
          nsfw={nsfw}
          isBgColorDark
        />

        <div className="card-item__content">
          <h3 className="card-item__title title title--fz-14 visible-line" title={title}>
            {title}
          </h3>
        </div>
      </Link>
    );
  },
);

interface RecommendationCardWithTooltip {
  item: RecommendationEntry;
  className?: string;
  tooltip?: boolean;
  nsfw?: boolean;
  key: any;
}

// ========== AnimeRecommendationCard ==========
export const AnimeRecommendationCard: React.FC<RecommendationCardWithTooltip> = ({
  item,
  className,
  nsfw = false,
  tooltip = true,
}) => {
  const renderCard = () => (
    <RecommendationCard
      nsfw={nsfw}
      item={item}
      className={className}
      linkPath={appPaths.animeFull(item.mal_id)}
    />
  );
  return tooltip ? <AnimeTooltip id={item.mal_id}>{renderCard()}</AnimeTooltip> : renderCard();
};

// ========== MangaRecommendationCard ==========
export const MangaRecommendationCard: React.FC<RecommendationCardWithTooltip> = ({
  item,
  className,
  nsfw = false,
  tooltip = true,
}) => {
  const renderCard = () => (
    <RecommendationCard
      nsfw={nsfw}
      item={item}
      className={className}
      linkPath={appPaths.mangaFull(item.mal_id)}
    />
  );
  return tooltip ? <MangaTooltip id={item.mal_id}>{renderCard()}</MangaTooltip> : renderCard();
};
