import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { formattedScore, getImageUrl, getShortAnimeRating } from '@/utils';
import { ArrowIcon, BookmarkIcon, StarIcon } from '@/components';
import { useYoutubeTrailerImage } from '@/hooks';
import { Anime } from '@/models';

import clsx from 'clsx';
import './Intro.scss';

const IntroSlide: React.FC<{ item: Anime }> = ({ item }) => {
  const { src, onLoad, isFallback } = useYoutubeTrailerImage(item.trailer.images);
  return (
    <div className="slide__container container">
      {src && (
        <img
          className={clsx('slide__bg', { '_not-found': isFallback })}
          src={src}
          alt="Background image"
          aria-hidden
          onLoad={onLoad}
        />
      )}

      <div className="slide__body">
        <div className="slide__image bg bodrer">
          <img src={getImageUrl(item.images)} alt="Poster" />
        </div>
        <div className="slide__content">
          <h2 className="slide__title title title--fz-48">
            <Link to={`/anime/${item.mal_id}`}>{item.title}</Link>
          </h2>
          <div className="slide__text fz-20 visible-line visible-line--3">{item.synopsis}</div>
          <div className="slide__info">
            <div className="slide__score-wrapper">
              <div className="slide__score">
                <StarIcon />
                <span>{formattedScore(item.score)}</span>
              </div>
              {item.scored_by && <div className="slide__score-users">{item.scored_by} ratings</div>}
            </div>
            <div className="slide__details">
              <Link
                className="slide__link slide__link--rating"
                title={item.rating + (item.rating ? '' : ' rating')}
                to="#">
                {getShortAnimeRating(item.rating)}
              </Link>
              {item.genres.map((genre) => (
                <Link key={genre.mal_id} className="slide__link" to="#">
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="slide__actions">
            <Link
              to={`/anime/${item.mal_id}`}
              className="slide__btn slide__btn--details btn btn--icon btn--stroke">
              Show details
              <ArrowIcon />
            </Link>
            <button className="slide__btn slide__btn--bookmark btn btn--icon btn--stroke btn--transparent">
              <BookmarkIcon />
              <span>Bookmark</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroSlide;

export const IntroSlideSkeleton = () => {
  return (
    <div className="slide intro__slide">
      <div className="slide__container container swiper-slide-visible">
        <div className="slide__body">
          <div className="slide__image bg">
            <Skeleton className="img" />
          </div>
          <div className="slide__content">
            <h2 className="slide__title title">
              <Skeleton />
            </h2>
            <div className="slide__text">
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton containerClassName="_skeleton-last" />
            </div>
            <div className="slide__info">
              <div className="slide__score-wrapper">
                <div className="slide__score">
                  <Skeleton width="50px" height="20px" />
                </div>
                <div className="slide__score-users">
                  <Skeleton width="80px" height="14px" />
                </div>
              </div>
              <div className="slide__details">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} width="65px" height="20px" />
                ))}
              </div>
            </div>
            <div className="slide__actions">
              <Skeleton className="slide__btn _skeleton " />
              <Skeleton className="slide__btn _skeleton _skeleton--bookmark" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
