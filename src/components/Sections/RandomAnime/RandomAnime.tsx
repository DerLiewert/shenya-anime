import React from 'react';
import { useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useYoutubeTrailerImage } from '@/hooks';
import { Score } from '../../UI';
import './RandomAnime.scss';
import { fetchRandomAnime } from '@/store/anime/randomAnimeSlice';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { getImageUrl } from '@/utils';
import { ArrowIcon, BookmarkIcon } from '@/components/Icons';

const RandomAnime: React.FC = () => {
  const item = useAppSelector((state) => state.randomAnime.item);
  const { src, onLoad, isFallback } = useYoutubeTrailerImage(item && item.trailer.images);

  useAbortableDispatch(fetchRandomAnime, undefined, !item);

  // if (!item)
  //   return (
  //     <section className="random-anime">
  //       <div className="random-anime__bg bg border-opacity">
  //         <Skeleton className="skeleton__img" />
  //       </div>
  //       <div className="container">
  //         <div className="random-anime__inner">
  //           <h2 className="random-anime__section-title title">Random Anime</h2>
  //           <div className="random-anime__body">
  //             <div className="random-anime__poster image-centered border-opacity">
  //               {/* <img src={getImageUrl(item)} alt="Poster" aria-hidden /> */}
  //             </div>
  //             <div className="random-anime__content">
  //               <h3 className="random-anime__title title">
  //                 <Skeleton />
  //               </h3>
  //               <div className="random-anime__info">
  //                 <Skeleton width="67px" height="30px" />
  //                 <div className="random-anime__link">
  //                   <Skeleton width="45px" height="22px" />
  //                 </div>
  //                 <p className="random-anime__info-text">
  //                   <Skeleton width="100px" height="22px" />
  //                 </p>
  //               </div>
  //               <p className="random-anime__text visible-line visible-line--4">
  //                 <Skeleton />
  //                 <Skeleton />
  //                 <Skeleton />
  //                 <Skeleton />
  //               </p>
  //               <div className="random-anime__genres">
  //                 {Array.from({ length: 3 }).map((_, i) => (
  //                   <a key={i} href="#" className="random-anime__link">
  //                     <Skeleton width="62px" height="22px" />
  //                   </a>
  //                 ))}
  //               </div>
  //               {/* <div className="random-anime__actions">
  //               <Link
  //                 to={`/anime/${item.mal_id}`}
  //                 className="random-anime__btn random-anime__btn--details btn btn--icon btn--stroke">
  //                 Show details
  //                 <ArrowIcon />
  //               </Link>
  //               <a
  //                 href="#"
  //                 className="random-anime__btn random-anime__btn--bookmark btn btn--icon btn--stroke btn--transparent">
  //                 <BookmarkIcon />
  //                 <span>Bookmark</span>
  //               </a>
  //             </div> */}
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </section>
  //   );

  // if (!item) return null;

  return (
    <section className="random-anime">
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
      <div className="container">
        <div className="random-anime__inner">
          <h2 className="random-anime__section-title title title--fz-36 title--main-color">
            Random Anime
          </h2>
          <div className="random-anime__body">
            <div className="random-anime__poster bg border-opacity">
              {item ? (
                <img src={getImageUrl(item.images)} alt="Poster" aria-hidden />
              ) : (
                <Skeleton className="img" />
              )}
            </div>
            <div className="random-anime__content">
              <h3 className="random-anime__title title title--fz-36">
                {item ? (
                  <Link to={`/anime/${item.mal_id}`} title={item.title}>
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
                  <Link to="#" className="random-anime__link link">
                    {item.type}
                  </Link>
                ) : (
                  <Skeleton className="random-anime__link" width="45px" height="22px" />
                )}

                <p className="random-anime__info-text">
                  {item ? `Episodes ${item.episodes}` : <Skeleton width="100px" height="22px" />}
                </p>
              </div>
              <p className="random-anime__text fz-20 visible-line visible-line--4">
                {item ? (
                  item.synopsis
                ) : (
                  <>
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                  </>
                )}
              </p>

              {item ? (
                <div className="random-anime__genres">
                  {item.demographics.length > 0 &&
                    item.demographics.map((demographic) => (
                      <Link key={demographic.mal_id} to="#" className="random-anime__link link">
                        {demographic.name}
                      </Link>
                    ))}
                  {item.genres.length > 0 &&
                    item.genres.map((genre) => (
                      <Link key={genre.mal_id} to="#" className="random-anime__link link">
                        {genre.name}
                      </Link>
                    ))}
                </div>
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
                      to={`/anime/${item.mal_id}`}
                      className="random-anime__btn random-anime__btn--details btn btn--icon btn--stroke">
                      Show details
                      <ArrowIcon />
                    </Link>
                    <button className="random-anime__btn random-anime__btn--bookmark btn btn--icon btn--stroke btn--transparent">
                      <BookmarkIcon />
                      <span>Bookmark</span>
                    </button>
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

export default RandomAnime;
