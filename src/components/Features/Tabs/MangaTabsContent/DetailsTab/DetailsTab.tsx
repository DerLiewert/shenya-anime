import React from 'react';
import { Link } from 'react-router-dom';
import { useShowMoreMap } from '@/hooks';
import { formattedScore, splitText } from '@/utils';
import { appPaths, mangaTypeOptions } from '@/resources';
import { mangaEmptyValueMessages, specialStatus } from '@/constants';
import { AnimeStatus, MangaFull } from '@/models';
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
  ScoreStats,
} from '@/components';
import './DetailsTab.scss';

const DetailsTab: React.FC<{ item: MangaFull | null }> = ({ item }) => {
  const { visibleCounts, initShowMore, showMore } = useShowMoreMap(6);

  React.useEffect(() => {
    if (item && item.relations) {
      initShowMore(item.relations.map((obj) => obj.relation));
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
                status={item.status as AnimeStatus}
                className="anime-details__info-label anime-details__info-label--status"
              />
              <p className="anime-details__info-label">
                Ranked {item.rank ? '# ' + item.rank : specialStatus.notAvailable}
              </p>
            </div>
          </div>
          <div className="anime-details__info-list">
            {item.type && (
              <InfoRow name={'Type'}>
                <InfoValue
                  isLink
                  to={appPaths.mangaWithParams({
                    type: mangaTypeOptions.find((obj) => obj.label === item.type)?.value,
                  })}>
                  {item.type}
                </InfoValue>
              </InfoRow>
            )}
            <InfoRow name="Chapters">
              <InfoValue>{item.chapters ? item.chapters : specialStatus.mark}</InfoValue>
            </InfoRow>
            <InfoRow name="Volumes">
              <InfoValue>{item.volumes ? item.volumes : specialStatus.mark}</InfoValue>
            </InfoRow>
            <InfoRow name="Published">
              <InfoValue>
                {item.published.prop.from.year ? (
                  <>
                    <FormatDate date={item.published.prop.from} />
                    {item.published.prop.to.year && (
                      <>
                        {' – '}
                        <FormatDate date={item.published.prop.to} />
                      </>
                    )}
                  </>
                ) : (
                  'Not yet published'
                )}
              </InfoValue>
            </InfoRow>

            <InfoRow name={item.authors.length > 1 ? 'Authors' : 'Author'}>
              {item.authors.length > 0 ? (
                item.authors.map((author) => (
                  <InfoValue key={author.mal_id} isLink to={appPaths.personFull(author.mal_id)}>
                    {author.name}
                  </InfoValue>
                ))
              ) : (
                <InfoValue>{specialStatus.unknown}</InfoValue>
              )}
            </InfoRow>

            <InfoRow name={item.serializations.length > 1 ? 'Serializations' : 'Serialization'}>
              {item.serializations.length > 0 ? (
                item.serializations.map((obj) => <InfoValue key={obj.mal_id}>{obj.name}</InfoValue>)
              ) : (
                <InfoValue>{specialStatus.unknown}</InfoValue>
              )}
            </InfoRow>

            {item.demographics.length > 0 && (
              <InfoRow name={item.demographics.length > 1 ? 'Demographics' : 'Demographic'}>
                {item.demographics.map((demographic) => (
                  <InfoValue
                    key={demographic.mal_id}
                    isLink
                    to={appPaths.mangaWithParams({ genres: demographic.mal_id.toString() })}>
                    {demographic.name}
                  </InfoValue>
                ))}
              </InfoRow>
            )}

            <InfoRow name={item.genres.length > 1 ? 'Genres' : 'Genre'}>
              {item.genres.length > 0 ? (
                item.genres.map((genre) => (
                  <InfoValue
                    key={genre.mal_id}
                    isLink
                    to={appPaths.mangaWithParams({ genres: genre.mal_id.toString() })}>
                    {genre.name}
                  </InfoValue>
                ))
              ) : (
                <InfoValue>{specialStatus.unknown}</InfoValue>
              )}
            </InfoRow>

            {item.themes.length > 0 && (
              <InfoRow name={item.themes.length > 1 ? 'Themes' : 'Theme'}>
                {item.themes.map((theme) => (
                  <InfoValue
                    key={theme.mal_id}
                    isLink
                    to={appPaths.mangaWithParams({ genres: theme.mal_id.toString() })}>
                    {theme.name}
                  </InfoValue>
                ))}
              </InfoRow>
            )}
          </div>
        </div>
        <div className="anime-details__score-stats">
          <div className="anime-details__score-stats-title">Score Status</div>
          <ScoreStats type="manga" />
        </div>
      </div>
      <div className="anime-details__synopsis">
        <SectionHeader title="Synopsis" className="anime-details__synopsis-header" />
        <div className="anime-details__text fz-16">
          {item.synopsis ? (
            splitText(item.synopsis).map((string, index) => <p key={index}>{string}</p>)
          ) : (
            <EmptyValueMessage message={mangaEmptyValueMessages.synopsis} />
          )}
        </div>
      </div>
      {/* <div className="anime-details__synopsis">
        <SectionHeader title="Background" className="anime-details__synopsis-header" />
        <div className="anime-details__text fz-16">
          {item.background ? (
            splitText(item.background).map((string, index) => <p key={index}>{string}</p>)
          ) : (
            <EmptyValueMessage message={mangaEmptyValueMessages.background} />
          )}
        </div>
      </div> */}
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
                          to={appPaths.animeFull(item.mal_id)}>
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
                      to={appPaths.mangaFull(item.mal_id)}
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
          <EmptyValueMessage message={mangaEmptyValueMessages.relations} />
        )}
      </div>
    </div>
  );
};

export default DetailsTab;
