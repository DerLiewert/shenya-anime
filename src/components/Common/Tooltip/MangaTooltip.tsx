import React from 'react';
import { Link } from 'react-router-dom';
import { useFetchStatus } from '@/hooks';
import { commonMessages, fallbackValues } from '@/constants';
import { valueOrDefault } from '@/utils';
import { appPaths, mangaTypeOptions } from '@/resources';
import {
  InfoRow,
  InfoValue,
  EmptyValueMessage,
  FormatDate,
  Loading,
  Score,
  Status,
  Tooltip,
  TooltipCommonProps,
  TooltipContentProps,
} from '@/components';
import './Tooltip.scss';

export const MangaTooltip = (props: TooltipCommonProps<'manga'>) => {
  return (
    <Tooltip
      type="manga"
      tooltipContent={({ item, status }) => <MangaTooltipContent item={item} status={status} />}
      {...props}
    />
  );
};

const MangaTooltipContent: React.FC<TooltipContentProps<'manga'>> = ({ item, status }) => {
  const { isLoading, isError, isIdle } = useFetchStatus(status, true);

  if (isIdle) return null;

  if (isLoading)
    return (
      <div className="tooltip">
        <Loading />
      </div>
    );
  if (isError)
    return (
      <div className="tooltip">
        <EmptyValueMessage message={commonMessages.error} />
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
          <Link to={appPaths.mangaFull(item.mal_id)} title={item.title}>
            {item.title}
          </Link>
        </h3>
        {item.synopsis && (
          <p className="tooltip__text visible-line visible-line--5">{item.synopsis}</p>
        )}
      </div>
      <div className="tooltip__section">
        <ul className="tooltip__list">
          <InfoRow name="Type">
            {item.type ? (
              <InfoValue
                isLink
                to={appPaths.mangaWithParams({
                  type: mangaTypeOptions.find((obj) => obj.label === item.type)?.value,
                })}>
                {item.type}
              </InfoValue>
            ) : (
              <InfoValue>{fallbackValues.unknown}</InfoValue>
            )}
          </InfoRow>

          <InfoRow name="Chapters">
            <InfoValue>{valueOrDefault(item.chapters, fallbackValues.mark)}</InfoValue>
          </InfoRow>
          <InfoRow name="Volumes">
            <InfoValue>{valueOrDefault(item.volumes, fallbackValues.mark)}</InfoValue>
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
                fallbackValues.unknown
              )}
            </InfoValue>
          </InfoRow>

          {item.authors.length > 0 && (
            <InfoRow name={item.authors.length > 1 ? 'Authors' : 'Author'}>
              {item.authors.map((author) => (
                <InfoValue key={author.mal_id} isLink to={appPaths.personFull(author.mal_id)}>
                  {author.name}
                </InfoValue>
              ))}
            </InfoRow>
          )}

          {item.serializations.length > 0 && (
            <InfoRow name={item.serializations.length > 1 ? 'Serializations' : 'Serialization'}>
              {item.serializations.map((obj) => (
                <InfoValue key={obj.mal_id}>{obj.name}</InfoValue>
              ))}
            </InfoRow>
          )}

          {item.demographics.length > 0 && (
            <InfoRow name={item.demographics.length > 1 ? 'Demographics' : 'Demographic'}>
              {item.demographics.map((demographic) => (
                <InfoValue
                  key={demographic.mal_id}
                  to={appPaths.mangaWithParams({ genres: demographic.mal_id.toString() })}
                  isLink>
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
                  to={appPaths.mangaWithParams({ genres: genre.mal_id.toString() })}
                  isLink>
                  {genre.name}
                </InfoValue>
              ))
            ) : (
              <InfoValue>{fallbackValues.unknown}</InfoValue>
            )}
          </InfoRow>

          {item.themes.length > 0 && (
            <InfoRow name={item.themes.length > 1 ? 'Themes' : 'Theme'}>
              {item.themes.map((theme) => (
                <InfoValue
                  key={theme.mal_id}
                  to={appPaths.mangaWithParams({ genres: theme.mal_id.toString() })}
                  isLink>
                  {theme.name}
                </InfoValue>
              ))}
            </InfoRow>
          )}
        </ul>
      </div>
    </div>
  );
};
