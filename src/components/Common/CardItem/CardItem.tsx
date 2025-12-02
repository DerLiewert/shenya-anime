import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/utils';
import { BookmarkButton, Score, SfwImage, Status } from '@/components';
import { AnimeAndMangaOf, AnimeAndMangaType } from '@/typescript';
import clsx from 'clsx';
import './CardItem.scss';

interface CardItemProps<T extends AnimeAndMangaType = AnimeAndMangaType> {
  linkPath: string;
  item: AnimeAndMangaOf<T> & { year: number | null };
  className?: string;
  nsfw: boolean;
  cardType: T;
  ref?: React.Ref<HTMLDivElement>;
}

const CardItem = React.forwardRef<HTMLDivElement, CardItemProps>(
  ({ linkPath, item, cardType, className, nsfw }, ref) => {
    const { images, title, type, year, status, score } = item;
    return (
      <div className={clsx(className, 'card-item border-opacity _title-parent')} ref={ref}>
        <BookmarkButton
          className="card-item__bookmark "
          // bookmarkedClassName="btn--stroke"
          // noBookmarkedClassName="btn--white"
          type={cardType}
          item={item}
          withText={false}
        />
        <Link to={linkPath} className="card-item__inner">
          <div className="card-item__image-block">
            <Status className="card-item__status" status={status} isShadow />
            <SfwImage
              classWrapper={'card-item__image border-radius'}
              src={getImageUrl(images)}
              alt="Poster"
              loading="lazy"
              nsfw={nsfw}
            />
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
      </div>
    );
  },
);

export default CardItem;
