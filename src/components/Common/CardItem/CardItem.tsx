import React from 'react';
import { Link } from 'react-router-dom';
import { Anime, AnimeStatus, JikanImages, Manga, MangaStatus } from '@/models';
import { getImageUrl } from '@/utils';
import { Score, Status } from '@/components/UI';
import clsx from 'clsx';
import './CardItem.scss';
import { AnimeTooltip, MangaTooltip } from '@/components';

interface CardItemProps {
  linkPath: string;
  images: JikanImages;
  title: string;
  type?: string | null;
  year?: number | null;
  status?: AnimeStatus | MangaStatus | null;
  score?: number | null;
  className?: string;
  ref?: React.Ref<HTMLAnchorElement>;
}

const CardItem = React.forwardRef<HTMLAnchorElement, CardItemProps>(
  (
    {
      linkPath,
      images,
      title,
      type = null,
      year = null,
      status = null,
      score = null,
      className,
      // ref,
    },
    ref,
  ) => {
    return (
      <Link
        to={linkPath}
        ref={ref}
        className={clsx(className, 'card-item border-opacity _title-parent')}>
        <div className="card-item__image bg ">
          <Status className="card-item__status" status={status} isShadow />
          <img src={getImageUrl(images)} alt="Poster" loading="lazy" />
          <Score className="card-item__score" score={score} isShadow />
        </div>
        <div className="card-item__content">
          <h3 className="card-item__title title title--fz-14 visible-line" title={title}>
            {title}
          </h3>
          <p className="card-item__text fz-13">
            <span>{type}</span>
            <span>{year}</span>
          </p>
        </div>
      </Link>
    );
  },
);

export default CardItem;

interface AnimeCardProps {
  item: Anime;
  className?: string;
  ref?: React.Ref<HTMLAnchorElement>;
  tooltip?: boolean;
}
export const AnimeCard: React.FC<AnimeCardProps> = ({ item, className, tooltip = true }) => {
  const { images, title, type, aired, status, score, mal_id } = item;
  const renderCardItem = () => (
    <CardItem
      className={className}
      linkPath={`/anime/${mal_id}`}
      images={images}
      title={title}
      type={type}
      year={aired.prop.from.year}
      status={status}
      score={score}
    />
  );
  return tooltip ? <AnimeTooltip item={item}>{renderCardItem()}</AnimeTooltip> : renderCardItem();
};

interface MangaCardProps {
  item: Manga;
  className?: string;
  ref?: React.Ref<HTMLAnchorElement>;
  tooltip?: boolean;
}
export const MangaCard: React.FC<MangaCardProps> = ({ item, ref, className, tooltip = true }) => {
  const { images, title, type, published, status, score, mal_id } = item;
  const renderCardItem = () => (
    <CardItem
      className={className}
      linkPath={`/manga/${mal_id}`}
      images={images}
      title={title}
      type={type}
      year={published.prop.from.year}
      status={status}
      score={score}
      ref={ref}
    />
  );
  return tooltip ? <MangaTooltip item={item}>{renderCardItem()}</MangaTooltip> : renderCardItem();
};
