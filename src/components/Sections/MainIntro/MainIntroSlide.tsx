import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { useYoutubeTrailerImage } from '@/hooks';
import { ArrowIcon, StarIcon, BookmarkButton, SfwImage } from '@/components';
import { formattedScore, getImageUrl, getShortAnimeRating, isAnimeNsfw } from '@/utils';
import { appPaths, animeRatingOptions } from '@/resources';
import { Anime } from '@/models';
import clsx from 'clsx';
import './MainIntro.scss';

interface MainIntroSlide {
  item: Anime;
  shouldRenderImage?: boolean;
}

export const MainIntroSlide: React.FC<MainIntroSlide> = ({ item, shouldRenderImage = true }) => {
  const { src, onLoad, isFallback, isLoading } = useYoutubeTrailerImage(item.trailer);
  console.log('src', src);

  return (
    <div className="main-slide__container container">
      {src && shouldRenderImage && (
        <img
          className={clsx('main-slide__bg', { _loading: isLoading, '_not-found': isFallback })}
          src={src}
          alt="Background image"
          aria-hidden
          onLoad={onLoad}
        />
      )}

      <div className="main-slide__body">
        <div className="main-slide__poster bg bodrer">
          {shouldRenderImage && (
            <SfwImage
              src={getImageUrl(item.images)}
              nsfw={isAnimeNsfw(item)}
              alt="Poster"
              loading="lazy"
            />
          )}
        </div>
        <div className="main-slide__content">
          <h2 className="main-slide__title title title--fz-48">
            <Link to={appPaths.animeFull(item.mal_id)}>{item.title}</Link>
          </h2>
          <div className="main-slide__text fz-20 visible-line visible-line--3">{item.synopsis}</div>

          <div className="main-slide__info">
            <div className="main-slide__score-wrapper">
              <div className="main-slide__score">
                <StarIcon />
                <span>{formattedScore(item.score)}</span>
              </div>
              {item.scored_by && (
                <div className="main-slide__score-users">{item.scored_by} ratings</div>
              )}
            </div>

            <div className="main-slide__details">
              <Link
                className="main-slide__link main-slide__link--rating"
                title={item.rating + (item.rating ? '' : ' rating')}
                to={appPaths.animeWithParams({
                  rating: animeRatingOptions.find((obj) => obj.label === item.rating)?.value,
                })}>
                {getShortAnimeRating(item.rating)}
              </Link>
              {item.genres.map((genre) => (
                <Link
                  key={genre.mal_id}
                  className="main-slide__link"
                  to={appPaths.animeWithParams({
                    genres: genre.mal_id.toString(),
                  })}>
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="main-slide__actions">
            <Link
              to={appPaths.animeFull(item.mal_id)}
              className="main-slide__btn main-slide__btn--details btn btn--icon btn--stroke">
              Show details
              <ArrowIcon />
            </Link>

            <BookmarkButton
              item={item}
              type="anime"
              className="main-slide__btn main-slide__btn--bookmark btn btn--icon btn--stroke"
              bookmarkedClassName="btn--white btn--fill"
              noBookmarkedClassName="btn--transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const MainIntroSkeleton = () => {
  return (
    <div className="main-intro__slide main-slide">
      <div className="main-slide__container container swiper-slide-visible">
        <div className="main-slide__body">
          <div className="main-slide__poster bg">
            <Skeleton className="img" />
          </div>
          <div className="main-slide__content">
            <h2 className="main-slide__title title title--fz-48">
              <Skeleton />
            </h2>
            <div className="main-slide__text fz-20">
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
            <div className="main-slide__info">
              <div className="main-slide__score-wrapper">
                <div className="main-slide__score">
                  <Skeleton width="50px" height="20px" />
                </div>
                <div className="main-slide__score-users">
                  <Skeleton width="80px" height="14px" />
                </div>
              </div>
              <div className="main-slide__details">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} width="65px" height="20px" />
                ))}
              </div>
            </div>
            <div className="main-slide__actions">
              <Skeleton className="main-slide__btn _skeleton border-radius" />
              <Skeleton className="main-slide__btn _skeleton border-radius _skeleton--bookmark" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
