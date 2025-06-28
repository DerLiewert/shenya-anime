import React from 'react';
import { Link } from 'react-router-dom';
import { useShowMoreMap } from '@/hooks';
import { formattedScore, getShortAnimeRating, splitText } from '@/utils';
import { SpecialStatus, animeEmptyValueMessages } from '@/variables';
import { Anime } from '@/models';
import {
  AnimeTooltip,
  InfoRow,
  InfoValue,
  SectionHeader,
  EmptyValueMessage,
  FormatDate,
  Loading,
  Status,
  ArrowIcon,
  StarIcon,
} from '@/components';
import ScoreStats from '../../ScoreStats';
import './DetailsTab.scss';

const DetailsTab: React.FC<{ item: Anime }> = ({ item }) => {
  const { visibleCounts, init, showMore } = useShowMoreMap(6);

  React.useEffect(() => {
    if (item && item.relations) {
      init(item.relations.map((obj) => obj.relation));
    }
  }, [item]);

  if (!item) return <Loading />;

  return (
    <div className="anime-details">
      <div className="anime-details__info">
        <div className="anime-details__info-content">
          <div className="anime-details__info-top">
            <div className="anime-details__score big-score">
              <StarIcon />
              <span className="big-score__value">{formattedScore(item.score)}</span>
              {item.scored_by && <span className="big-score__votes">{item.scored_by} users</span>}
            </div>
            <div className="anime-details__info-labels">
              <Status
                status={item.status}
                className="anime-details__info-label anime-details__info-label--status"
              />
              <p className="anime-details__info-label">
                Ranked {item.rank ? '# ' + item.rank : SpecialStatus.NotAvailable}
              </p>
            </div>
          </div>
          <div className="anime-details__info-list">
            <InfoRow name={'Type'}>
              {item.type && (
                <InfoValue isLink to="#">
                  {item.type}
                </InfoValue>
              )}
            </InfoRow>
            <InfoRow name={'Rating'}>
              {item.rating ? (
                <InfoValue isLink to="#" isLinkPrimary title={item.rating}>
                  {getShortAnimeRating(item.rating)}
                </InfoValue>
              ) : (
                <InfoValue>{SpecialStatus.Unknown}</InfoValue>
              )}
            </InfoRow>
            <InfoRow name="Episodes">
              <InfoValue>{item.episodes ? item.episodes : SpecialStatus.QuestionMark}</InfoValue>
            </InfoRow>
            <InfoRow name="Episode duration">
              <InfoValue>{item.duration ? item.duration : SpecialStatus.Unknown}</InfoValue>
            </InfoRow>
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
                  'Not yet aired'
                )}
              </InfoValue>
            </InfoRow>

            {item.season && (
              <InfoRow name="Season">
                <InfoValue isLink to="#" className="_capitalize">
                  {item.season} {item.year}
                </InfoValue>
              </InfoRow>
            )}

            <InfoRow name={item.studios.length > 1 ? 'Studios' : 'Studio'}>
              {item.studios.length > 0 ? (
                item.studios.map((studio) => (
                  <InfoValue key={studio.mal_id} isLink to="#">
                    {studio.name}
                  </InfoValue>
                ))
              ) : (
                <InfoValue>{SpecialStatus.Unknown}</InfoValue>
              )}
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

            <InfoRow name={item.genres.length > 1 ? 'Genres' : 'Genre'}>
              {item.genres.length > 0 ? (
                item.genres.map((genre) => (
                  <InfoValue key={genre.mal_id} isLink to="#">
                    {genre.name}
                  </InfoValue>
                ))
              ) : (
                <InfoValue>{SpecialStatus.Unknown}</InfoValue>
              )}
            </InfoRow>

            {item.themes.length > 0 && (
              <InfoRow name={item.themes.length > 1 ? 'Themes' : 'Theme'}>
                {item.themes.map((theme) => (
                  <InfoValue key={theme.mal_id} isLink to="#">
                    {theme.name}
                  </InfoValue>
                ))}
              </InfoRow>
            )}
          </div>
        </div>
        <div className="anime-details__score-stats">
          <div className="anime-details__score-stats-title">Score Status</div>
          <ScoreStats id={item.mal_id} />
        </div>
      </div>
      <div className="anime-details__synopsis">
        <SectionHeader title="Synopsis" className="anime-details__synopsis-header" />
        <div className="anime-details__text fz-16">
          {item.synopsis ? (
            splitText(item.synopsis).map((string, index) => <p key={index}>{string}</p>)
          ) : (
            <EmptyValueMessage message={animeEmptyValueMessages.synopsis} />
          )}
        </div>
      </div>
      <div className="anime-details__streaming">
        <SectionHeader title="Where to Watch" className="anime-details__streaming-header" />
        {item.streaming && item.streaming.length > 0 ? (
          <div className="anime-details__streaming-items tab-grid-3">
            {item.streaming.map((obj) => (
              <a
                key={obj.name}
                className="anime-details__streaming-item border fz-16"
                href={obj.url}
                target="_blank"
                rel="noopener noreferrer">
                {obj.name}
              </a>
            ))}
          </div>
        ) : (
          <EmptyValueMessage message={animeEmptyValueMessages.streaming} />
        )}
      </div>
      <div className="anime-details__producers">
        <SectionHeader
          title="Producers"
          link={{
            url: `staff`,
            text: 'All staffs',
          }}
          className="anime-details__producers-header"
        />
        {item.producers && item.producers.length > 0 ? (
          <div className="anime-details__producers-items">
            {item.producers.map((obj) => (
              <Link key={obj.mal_id} className="anime-details__producers-item border fz-16" to="#">
                {obj.name}
              </Link>
            ))}
          </div>
        ) : (
          <EmptyValueMessage message={animeEmptyValueMessages.producers} />
        )}
      </div>
      <div className="anime-details__related">
        <SectionHeader title="Related Entries" className="anime-details__related-header" />
        {item.relations && item.relations.length > 0 ? (
          item.relations.map((obj) => (
            <div key={obj.relation} className="anime-details__related-block">
              <h4 className="anime-details__related-subtitle">{obj.relation}</h4>
              <div className="anime-details__related-items tab-grid-3">
                {obj.entry.slice(0, visibleCounts[obj.relation]).map((item) => {
                  if (item.type.toLowerCase() === 'anime') {
                    return (
                      <AnimeTooltip key={item.mal_id} id={item.mal_id}>
                        <Link
                          className="anime-details__related-item related-item border fz-16"
                          to={`/anime/${item.mal_id}`}>
                          <p className="related-item__name visible-line visible-line--1">
                            {item.name}
                          </p>
                          <p className="related-item__type fz-14">{item.type}</p>
                        </Link>
                      </AnimeTooltip>
                    );
                  }

                  return (
                    <Link
                      key={item.mal_id}
                      className="anime-details__related-item related-item border fz-16"
                      to={`/manga/${item.mal_id}`}
                      title={item.name}>
                      <p className="related-item__name visible-line visible-line--1">{item.name}</p>
                      <p className="related-item__type fz-14">{item.type}</p>
                    </Link>
                  );
                })}
              </div>
              {obj.entry.length > 0 && visibleCounts[obj.relation] < obj.entry.length && (
                <div className="anime-details__show-more-wrapper">
                  <button
                    className="anime-details__show-more"
                    onClick={() => showMore(obj.relation)}>
                    Show More
                    <ArrowIcon />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <EmptyValueMessage message={animeEmptyValueMessages.relations} />
        )}
      </div>
    </div>
  );
};

export default DetailsTab;
