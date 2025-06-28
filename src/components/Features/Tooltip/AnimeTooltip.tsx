// TooltipWrapper.tsx
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import Tippy from '@tippyjs/react';
import { Anime } from '../../../models';
import { getShortAnimeRating } from '../../../utils';
import { SpecialStatus } from '../../../variables';

import './Tooltip.scss';
import { FormatDate, Loading, Score, Status } from '../../UI';
import { InfoRow, InfoValue } from '../../Common/InfoRowWithValue';
import { getAnimeById } from '@/api/anime.client';
import { Link } from 'react-router-dom';

type AnimeTooltipProps = { children: React.ReactElement } & (
  | { id: number; item?: never }
  | { id?: never; item: Anime }
);

const AnimeTooltip = ({ children, item, id }: AnimeTooltipProps) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767.98px)' });
  const [animeItem, setAnimeItem] = React.useState(item);

  const onShowTippy = () => {
    if (!id || animeItem) return;

    const getAnime = async () => {
      const { data } = await getAnimeById(id);
      setAnimeItem(data);
    };
    getAnime();
  };

  return (
    <Tippy
      content={<AnimeTooltipContent item={animeItem ? animeItem : null} />}
      visible={isMobile ? false : undefined}
      placement="right-start"
      theme="custom"
      interactive={true}
      appendTo={document.body}
      duration={300}
      delay={600}
      animation="fade-smooth"
      onShow={onShowTippy}
      popperOptions={{
        modifiers: [
          {
            name: 'eventListeners',
            options: {
              scroll: false,
              resize: false,
            },
          },
        ],
      }}>
      {children}
    </Tippy>
  );
};

// type AnimeTooltipContentProps = { id: number; item?: never } | { id?: never; item: Anime };
const AnimeTooltipContent: React.FC<{ item: Anime | null }> = ({ item }) => {
  return (
    <div className="tooltip">
      {!item ? (
        <Loading />
      ) : (
        <>
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
                    <InfoValue isLink to="#">
                      {item.type}
                    </InfoValue>
                  )}
                  {item.rating && (
                    <InfoValue isLink to="#" isLinkPrimary title={item.rating}>
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
                    <InfoValue key={demographic.mal_id} isLink to="#">
                      {demographic.name}
                    </InfoValue>
                  ))}
                </InfoRow>
              )}

              {item.genres.length > 0 && (
                <InfoRow name={item.genres.length > 1 ? 'Genres' : 'Genre'}>
                  {item.genres.map((genre) => (
                    <InfoValue key={genre.mal_id} isLink to={`/catalog?genres=${genre.mal_id}`}>
                      {genre.name}
                    </InfoValue>
                  ))}
                </InfoRow>
              )}

              {item.themes.length > 0 && (
                <InfoRow name={item.themes.length > 1 ? 'Themes' : 'Theme'}>
                  {item.themes.map((theme) => (
                    <InfoValue key={theme.mal_id} isLink to="#">
                      {theme.name}
                    </InfoValue>
                  ))}
                </InfoRow>
              )}

              {item.studios.length > 0 && (
                <InfoRow name={item.studios.length > 1 ? 'Studios' : 'Studio'}>
                  {item.studios.map((studio) => (
                    <InfoValue key={studio.mal_id} isLink to="#">
                      {studio.name}
                    </InfoValue>
                  ))}
                </InfoRow>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default AnimeTooltip;
