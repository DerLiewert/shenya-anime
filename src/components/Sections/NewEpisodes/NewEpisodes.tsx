import React from 'react';
import { SectionHeader } from '../../Common/SectionHeader';
import { useAppSelector } from '../../../app/hooks';
import { getImageUrl, uniqueAnime, valueOrDefault } from '../../../utils';

import Masonry from 'react-masonry-css';
import { InfoRow, InfoValue } from '../../Common';
import { useAbortableDispatch, useFetchStatus } from '@/hooks';
import { fetchTodaySchedulesAnime } from '@/store/anime/todaySchedulesAnimeSlice';
import { Link } from 'react-router-dom';
import { ArrowIcon, EmptyValueMessage } from '@/components';
import { FetchStatus } from '@/types';

import Skeleton from 'react-loading-skeleton';

import './NewEpisodes.scss';
import { animeEmptyValueMessages, commonMessages } from '@/variables/emptyValueMessages';

const NewEpisodes: React.FC = () => {
  const { items, status } = useAppSelector((state) => state.todaySchedulesAnime);
  const { isLoading, isSuccess, isError } = useFetchStatus(status);
  useAbortableDispatch(fetchTodaySchedulesAnime, undefined, items.length === 0);

  const renderSkeletons = () =>
    Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className="new-episodes__item new-episode border-opacity _skeleton" />
    ));

  const renderItems = () =>
    uniqueAnime(items)
      .splice(0, 6)
      .map((item) => (
        <Link
          to={`/anime/${item.mal_id}`}
          key={item.mal_id}
          className="new-episodes__item new-episode border-opacity">
          <div className="new-episode__inner _title-parent">
            <div className="new-episode__image bg">
              <img src={getImageUrl(item.images)} alt="Poster" loading="lazy" />
            </div>
            <div className="new-episode__body">
              <h4 className="new-episode__title title title--fz-14 visible-line" title={item.title}>
                {item.title}
              </h4>
              <ul className="new-episode__list">
                <InfoRow name="Episodes" className="new-episode__list-item fz-13">
                  <InfoValue>{valueOrDefault(item.episodes)}</InfoValue>
                </InfoRow>
                <InfoRow name="Type" className="new-episode__list-item fz-13">
                  <InfoValue>{item.type}</InfoValue>
                </InfoRow>
                <InfoRow name="Genres" className="new-episode__list-item fz-13">
                  {item.genres.map((genre, index, arr) => (
                    <InfoValue key={genre.mal_id}>
                      {genre.name}
                      {index < arr.length - 1 && ','}
                    </InfoValue>
                  ))}
                </InfoRow>

                <InfoRow name="Broadcast" className="new-episode__list-item fz-13 _broadcast">
                  <InfoValue>
                    {item.broadcast.time
                      ? `${item.broadcast.time}, ${item.broadcast.timezone}`
                      : 'Unknown'}
                  </InfoValue>
                </InfoRow>
              </ul>
            </div>
          </div>
        </Link>
      ));

  const renderEmpty = () => (
    <EmptyValueMessage
      message={isError ? commonMessages.error : animeEmptyValueMessages.newEpisodes}
    />
  );

  return (
    <div className="new-episodes">
      <div className="container">
        <SectionHeader
          className="new-episodes__section-header"
          title="New Episodes"
          link={{ url: '#', text: 'View release calendar' }}
        />
        <h3 className="new-episodes__subtitle title title--fz-24 title--main-color">Today</h3>
        <div className="new-episodes__body">
          {isLoading ? renderSkeletons() : isSuccess ? renderItems() : renderEmpty()}
        </div>
        {isLoading ? (
          <Skeleton className="new-episodes__btn-wrapper border-opacity _skeleton" />
        ) : (
          isSuccess &&
          uniqueAnime(items).length > 6 && (
            <div className="new-episodes__btn-wrapper">
              <Link
                to={`#`}
                className="new-episodes__btn btn btn--icon btn--upper btn--stroke show-more-btn">
                View more
                <ArrowIcon />
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default NewEpisodes;

/* 

const breakpointColumnsObj = {
   default: 3,
   1100: 2,
   768: 1,
 };

<Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column">
          {items.map((item) => (
            <div key={item.mal_id} className="new-episodes__item new-episode border-opacity ">
              <div className="new-episode__inner"
                <div className="new-episode__image image-centered">
                  <img src={getImageUrl(item)} alt="Poster" loading="lazy" />
                </div>
                <div className="new-episode__body">
                  <h4 className="new-episode__title title" title={item.title}>
                    {item.title}
                  </h4>
                  <ul className="new-episode__list">
                    <InfoRow name="Episodes" className="new-episode__list-item">
                      <InfoValue>{valueOrDefault(item.episodes)}</InfoValue>
                    </InfoRow>
                    <InfoRow name="Type" className="new-episode__list-item">
                      <InfoValue isLink href="#">
                        {item.type}
                      </InfoValue>
                    </InfoRow>
                    <InfoRow name="Genres" className="new-episode__list-item">
                      {item.genres.map((genre) => (
                        <InfoValue key={genre.mal_id} isLink href="#">
                          {genre.name}
                        </InfoValue>
                      ))}
                    </InfoRow>
                    {item.broadcast.time && (
                      <InfoRow name="Broadcast" className="new-episode__list-item _broadcast">
                        <InfoValue>
                          {item.broadcast.time}, {item.broadcast.timezone}
                        </InfoValue>
                      </InfoRow>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </Masonry> */
