import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/utils';
import { appPaths } from '@/resources';
import { RecommendationEntry } from '@/typescript';
import { AnimeTooltip, MangaTooltip, SfwImage } from '@/components';
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
    return (
      <Link ref={ref} to={linkPath} className={clsx(className, 'card-item border-opacity')}>
        <SfwImage
          classWrapper="card-item__image-block border-radius"
          src={getImageUrl(item.images)}
          alt="Poster"
          loading="lazy"
          nsfw={nsfw}
          isBgColorDark
        />

        <div className="card-item__content">
          <h3 className="card-item__title title title--fz-14 visible-line" title={item.title}>
            {item.title}
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
}

// ========== AnimeRecommendationCard ==========
export const AnimeRecommendationCard = ({
  item,
  className,
  nsfw = false,
  tooltip = true,
}: RecommendationCardWithTooltip) => {
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
export const MangaRecommendationCard = ({
  item,
  className,
  nsfw = false,
  tooltip = true,
}: RecommendationCardWithTooltip) => {
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
