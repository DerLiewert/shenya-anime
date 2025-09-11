// TooltipWrapper.tsx
import React from 'react';
import { Anime } from '@/models';
import { getShortAnimeRating } from '@/utils';
import {
  animePaths,
  animeRatingOptions,
  animeTypeOptions,
  producerPaths,
  SpecialStatus,
} from '@/variables';

import { EmptyValueMessage, FormatDate, Loading, Score, Status } from '../../UI';
import { InfoRow, InfoValue } from '../../Common/InfoRowWithValue';
import { getAnimeById } from '@/api/anime.client';
import { Link } from 'react-router-dom';
import { FetchStatus } from '@/typescript';
import { useFetchStatus } from '@/hooks';
import './Tooltip.scss';
import TooltipWrapperProps from './Tooltip';

type AnimeTooltipProps = { children: React.ReactElement } & (
  | { id: number; item?: never }
  | { id?: never; item: Anime }
);

const AnimeTooltip = ({ children, item, id }: AnimeTooltipProps) => {
  const [animeItem, setAnimeItem] = React.useState(item);
  const [status, setStatus] = React.useState<FetchStatus>(
    item ? FetchStatus.SUCCESS : FetchStatus.LOADING,
  );

  const onShowTippy = () => {
    if (!id || animeItem) return;

    setStatus(FetchStatus.LOADING);

    const getAnime = async () => {
      try {
        const { data } = await getAnimeById(id);
        setAnimeItem(data);
        setStatus(FetchStatus.SUCCESS);
      } catch (error) {
        setStatus(FetchStatus.ERROR);
      }
    };

    getAnime();
  };

  return (
    <TooltipWrapperProps
      content={<AnimeTooltipContent item={animeItem ? animeItem : null} status={status} />}
      onShowTippy={onShowTippy}>
      {children}
    </TooltipWrapperProps>
  );
};

// type AnimeTooltipContentProps = { id: number; item?: never } | { id?: never; item: Anime };
const AnimeTooltipContent: React.FC<{ item: Anime | null; status: FetchStatus }> = ({
  item,
  status,
}) => {
  const { isLoading, isError, isSuccess } = useFetchStatus(status);
  if (isLoading)
    return (
      <div className="tooltip">
        <Loading />
      </div>
    );
  if (isError)
    return (
      <div className="tooltip">
        <EmptyValueMessage message="Something went wrong!!!" />
      </div>
    );

  if (!item)
    return (
      <div className="tooltip">
        <EmptyValueMessage message="No information" />
      </div>
    );
  return (
    <div className="tooltip">
      <div className="tooltip__labels">
        <Score className="tooltip__label tooltip__label--score" score={item.score} />
        <Status className="tooltip__label tooltip__label--status" status={item.status} />
      </div>
      <div className="tooltip__section">
        <h3 className="tooltip__title title visible-line visible-line--2">
          <Link to={`/anime/${item.mal_id}`} title={item.title}>
            {item.title}
          </Link>
        </h3>
        {item.synopsis && (
          <p className="tooltip__text visible-line visible-line--5">{item.synopsis}</p>
        )}
      </div>
      <div className="tooltip__section">
        <ul className="tooltip__list">
          {(item.type || item.rating) && (
            <InfoRow name={item.type ? 'Type' : 'Rating'}>
              {item.type && (
                <InfoValue
                  isLink
                  to={animePaths.catalogWithParams({
                    type: animeTypeOptions.find((obj) => obj.label === item.type)?.value,
                  })}>
                  {item.type}
                </InfoValue>
              )}
              {item.rating && (
                <InfoValue
                  to={animePaths.catalogWithParams({
                    rating: animeRatingOptions.find((obj) => obj.label === item.rating)?.value,
                  })}
                  isLink
                  isLinkPrimary
                  title={item.rating}>
                  {getShortAnimeRating(item.rating)}
                </InfoValue>
              )}
            </InfoRow>
          )}

          {item.episodes && (
            <InfoRow name="Episodes">
              <InfoValue>
                {item.episodes}
                {item.duration && item.duration !== SpecialStatus.Unknown && (
                  <>
                    &nbsp;&nbsp; {/* 2 spaces */}
                    <span>( {item.duration} )</span>
                  </>
                )}
              </InfoValue>
            </InfoRow>
          )}

          <InfoRow name="Aired">
            <InfoValue>
              {item.aired.prop.from.year ? (
                <>
                  <FormatDate date={item.aired.prop.from} />
                  {item.aired.prop.to.year && (
                    <>
                      {' – '}
                      <FormatDate date={item.aired.prop.to} />
                    </>
                  )}
                </>
              ) : (
                SpecialStatus.Unknown
              )}
            </InfoValue>
          </InfoRow>

          {item.demographics.length > 0 && (
            <InfoRow name={item.demographics.length > 1 ? 'Demographics' : 'Demographic'}>
              {item.demographics.map((demographic) => (
                <InfoValue
                  key={demographic.mal_id}
                  isLink
                  to={animePaths.catalogWithParams({ genres: demographic.mal_id.toString() })}>
                  {demographic.name}
                </InfoValue>
              ))}
            </InfoRow>
          )}

          {item.genres.length > 0 && (
            <InfoRow name={item.genres.length > 1 ? 'Genres' : 'Genre'}>
              {item.genres.map((genre) => (
                <InfoValue
                  key={genre.mal_id}
                  isLink
                  to={animePaths.catalogWithParams({ genres: genre.mal_id.toString() })}>
                  {genre.name}
                </InfoValue>
              ))}
            </InfoRow>
          )}

          {item.themes.length > 0 && (
            <InfoRow name={item.themes.length > 1 ? 'Themes' : 'Theme'}>
              {item.themes.map((theme) => (
                <InfoValue
                  key={theme.mal_id}
                  isLink
                  to={animePaths.catalogWithParams({ genres: theme.mal_id.toString() })}>
                  {theme.name}
                </InfoValue>
              ))}
            </InfoRow>
          )}

          {item.studios.length > 0 && (
            <InfoRow name={item.studios.length > 1 ? 'Studios' : 'Studio'}>
              {item.studios.map((studio) => (
                <InfoValue key={studio.mal_id} isLink to={producerPaths.full(studio.mal_id)}>
                  {studio.name}
                </InfoValue>
              ))}
            </InfoRow>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AnimeTooltip;
