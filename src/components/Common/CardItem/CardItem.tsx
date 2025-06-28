import React from 'react';
import { Link } from 'react-router-dom';
import { Anime, AnimeStatus, JikanImages, RecommendationEntry } from '@/models';
import { getImageUrl } from '@/utils';
import { Score, Status } from '@/components/UI';
import clsx from 'clsx';
import './CardItem.scss';

interface CardItemProps {
  linkPath: string;
  images: JikanImages;
  title: string;
  type?: string | null;
  year?: number | null;
  status?: AnimeStatus | null;
  score?: number | null;
  className?: string;
  ref?: React.Ref<HTMLAnchorElement>;
}

const CardItem: React.FC<CardItemProps> = ({
  linkPath,
  images,
  title,
  type = null,
  year = null,
  status = null,
  score = null,
  className,
  ref,
}) => {
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
};

/* 
 linkPath
 images
 title
 type?
 year?
 status?
 score?
*/
// const CardItem: React.FC<ICardItemProps> = ({ item, ref }) => {
//   return (
//     <Link to={`/anime/${item.mal_id}`} ref={ref} className="card-item border-opacity">
//       <div className="card-item__image bg ">
//         <Status className="card-item__status" status={item.status} isShadow />
//         <img src={getImageUrl(item)} alt="Poster" loading="lazy" />
//         <Score className="card-item__score" score={item.score} isShadow />
//       </div>
//       <div className="card-item__content">
//         <h3 className="card-item__title title visible-line" title={item.title}>
//           {item.title}
//         </h3>
//         <p className="card-item__text">
//           <span>{item.type}</span>
//           <span>{item.aired.prop.from.year}</span>
//         </p>
//       </div>
//     </Link>
//   );
// };

export default CardItem;

interface AnimeCardProps {
  item: Anime;
  className?: string;
  ref?: React.Ref<HTMLAnchorElement>;
}
export const AnimeCard: React.FC<AnimeCardProps> = ({ item, ref, className }) => {
  const { images, title, type, aired, status, score, mal_id } = item;

  return (
    <CardItem
      className={className}
      linkPath={`/anime/${mal_id}`}
      images={images}
      title={title}
      type={type}
      year={aired.prop.from.year}
      status={status}
      score={score}
      ref={ref}
    />
  );
};

interface RecommendationAnimeCardProps {
  item: RecommendationEntry;
  className?: string;
  ref?: React.Ref<HTMLAnchorElement>;
}
export const RecommendationAnimeCard: React.FC<RecommendationAnimeCardProps> = ({
  item,
  ref,
  className,
}) => {
  const { images, title, mal_id } = item;
  return (
    <Link to={`/anime/${mal_id}`} ref={ref} className={clsx(className, 'card-item border-opacity')}>
      <div className="card-item__image bg bg--dark">
        <img src={getImageUrl(images)} alt="Poster" loading="lazy" />
      </div>
      <div className="card-item__content">
        <h3 className="card-item__title title title--fz-14 visible-line" title={title}>
          {title}
        </h3>
      </div>
    </Link>
  );
};
