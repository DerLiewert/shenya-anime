import React from 'react';
import clsx from 'clsx';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useFetchStatus, useYoutubeTrailerImage } from '@/hooks';
import { clearRandomAnimeState, fetchRandomAnime } from '@/store';
import { animeEmptyValueMessages } from '@/constants';
import { appPaths, animeTypeOptions } from '@/resources';
import { getImageUrl, isAnimeNsfw, valueOrDefault } from '@/utils';
import { Score, ArrowIcon, BookmarkButton, EmptyValueMessage, SfwImage } from '@/components';
import './RandomAnime.scss';

export const RandomAnime = () => {
  const dispatch = useAppDispatch();
  const abortableDispatch = useAbortableDispatch();
  const { item, status } = useAppSelector((state) => state.randomAnime);
  const { isSuccess, isError } = useFetchStatus(status);
  const { src, onLoad, isFallback } = useYoutubeTrailerImage(item && item.trailer);

  React.useEffect(() => {
    abortableDispatch(fetchRandomAnime);
    return () => {
      dispatch(clearRandomAnimeState());
    };
  }, []);

  if (isError || (isSuccess && !item)) return null;

  return (
    <section className="random-anime">
      {/* Background image */}
      <div className="random-anime__bg bg border-opacity">
        {src ? (
          <img
            className={clsx({ '_not-found': isFallback })}
            src={src}
            onLoad={onLoad}
            alt="Poster"
            aria-hidden
          />
        ) : (
          <Skeleton className="img" />
        )}
      </div>

      {/* Content container */}
      <div className="container">
        <div className="random-anime__inner">
          <h2 className="random-anime__section-title title title--fz-36 title--main-color">
            Random Anime
          </h2>

          <div className="random-anime__body">
            {item ? (
              <SfwImage
                classWrapper="random-anime__poster border-opacity"
                src={getImageUrl(item.images)}
                nsfw={isAnimeNsfw(item)}
                alt="Poster"
                loading="lazy"
                aria-hidden
              />
            ) : (
              <Skeleton
                className="img"
                containerClassName="random-anime__poster border-opacity inline-block bg"
              />
            )}

            {/* Info about anime */}
            <div className="random-anime__content">
              <h3 className="random-anime__title title title--fz-36">
                {item ? (
                  <Link to={appPaths.animeFull(item.mal_id)} title={item.title}>
                    {item.title}
                  </Link>
                ) : (
                  <Skeleton />
                )}
              </h3>

              <div className="random-anime__info">
                {item ? (
                  <Score className="random-anime__score" score={item.score} isShadow />
                ) : (
                  <Skeleton width="67px" height="30px" />
                )}

                {item ? (
                  <Link
                    to={appPaths.animeWithParams({
                      type: animeTypeOptions.find((obj) => obj.label === item.type)?.value,
                    })}
                    className="random-anime__link link">
                    {item.type}
                  </Link>
                ) : (
                  <Skeleton className="random-anime__link" width="45px" height="22px" />
                )}

                <p className="random-anime__info-text">
                  {item ? (
                    `Episodes ${valueOrDefault(item.episodes)}`
                  ) : (
                    <Skeleton width="100px" height="22px" />
                  )}
                </p>
              </div>

              <p className="random-anime__text fz-20 visible-line visible-line--4">
                {item
                  ? item.synopsis || (
                      <EmptyValueMessage message={animeEmptyValueMessages.synopsis} />
                    )
                  : Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)}
              </p>

              {item ? (
                (item.demographics.length > 0 || item.genres.length > 0) && (
                  <div className="random-anime__genres">
                    {item.demographics.map((demographic) => (
                      <Link
                        key={demographic.mal_id}
                        to={appPaths.animeWithParams({
                          genres: demographic.mal_id.toString(),
                        })}
                        className="random-anime__link link">
                        {demographic.name}
                      </Link>
                    ))}

                    {item.genres.map((genre) => (
                      <Link
                        key={genre.mal_id}
                        to={appPaths.animeWithParams({
                          genres: genre.mal_id.toString(),
                        })}
                        className="random-anime__link link">
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                )
              ) : (
                <div className="random-anime__genres">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="random-anime__link">
                      <Skeleton width="62px" height="22px" />
                    </div>
                  ))}
                </div>
              )}

              <div className="random-anime__actions">
                {item ? (
                  <>
                    <Link
                      to={appPaths.animeFull(item.mal_id)}
                      className="random-anime__btn random-anime__btn--details btn btn--icon btn--stroke">
                      Show details
                      <ArrowIcon />
                    </Link>
                    <BookmarkButton
                      item={item}
                      type="anime"
                      className="random-anime__btn random-anime__btn--bookmark btn btn--icon btn--stroke"
                      bookmarkedClassName="btn--white btn--fill"
                      noBookmarkedClassName="btn--transparent"
                    />
                  </>
                ) : (
                  <>
                    <Skeleton className="slide__btn _skeleton " />
                    <Skeleton className="slide__btn _skeleton _skeleton--bookmark" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
