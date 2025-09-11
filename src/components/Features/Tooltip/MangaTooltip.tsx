// TooltipWrapper.tsx
import React from 'react';
import { Manga } from '@/models';
import { mangaPaths, mangaTypeOptions, SpecialStatus } from '@/variables';

import { EmptyValueMessage, FormatDate, Loading, Score, Status } from '../../UI';
import { InfoRow, InfoValue } from '../../Common/InfoRowWithValue';
import { Link } from 'react-router-dom';
import { FetchStatus } from '@/typescript';
import { useFetchStatus } from '@/hooks';
import TooltipWrapperProps from './Tooltip';
import { getMangaById } from '@/api/manga.client';
import './Tooltip.scss';

type MangaTooltipProps = { children: React.ReactElement } & (
  | { id: number; item?: never }
  | { id?: never; item: Manga }
);

const MangaTooltip = ({ children, item, id }: MangaTooltipProps) => {
  const [mangaItem, setMangaItem] = React.useState(item);
  const [status, setStatus] = React.useState<FetchStatus>(
    item ? FetchStatus.SUCCESS : FetchStatus.LOADING,
  );

  const onShowTippy = () => {
    if (!id || mangaItem) return;

    setStatus(FetchStatus.LOADING);

    const getManga = async () => {
      try {
        const { data } = await getMangaById(id);
        setMangaItem(data);
        setStatus(FetchStatus.SUCCESS);
      } catch (error) {
        setStatus(FetchStatus.ERROR);
      }
    };

    getManga();
  };

  return (
    <TooltipWrapperProps
      content={<MangaTooltipContent item={mangaItem ? mangaItem : null} status={status} />}
      onShowTippy={onShowTippy}>
      {children}
    </TooltipWrapperProps>
  );
};

export default MangaTooltip;

const MangaTooltipContent: React.FC<{ item: Manga | null; status: FetchStatus }> = ({
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
        <Status className="tooltip__label tooltip__label--status" status={item.status as any} />
      </div>
      <div className="tooltip__section">
        <h3 className="tooltip__title title visible-line visible-line--2">
          <Link to={`/manga/${item.mal_id}`} title={item.title}>
            {item.title}
          </Link>
        </h3>
        {item.synopsis && (
          <p className="tooltip__text visible-line visible-line--5">{item.synopsis}</p>
        )}
      </div>
      <div className="tooltip__section">
        <ul className="tooltip__list">
          {item.type && (
            <InfoRow name={'Type'}>
              <InfoValue
                isLink
                to={mangaPaths.catalogWithParams({
                  type: mangaTypeOptions.find((obj) => obj.label === item.type)?.value,
                })}>
                {item.type}
              </InfoValue>
            </InfoRow>
          )}

          <InfoRow name="Chapters">
            <InfoValue>{item.chapters ? item.chapters : SpecialStatus.QuestionMark}</InfoValue>
          </InfoRow>
          <InfoRow name="Volumes">
            <InfoValue>{item.volumes ? item.volumes : SpecialStatus.QuestionMark}</InfoValue>
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
                <InfoValue key={author.mal_id} isLink to={`/people/${author.mal_id}`}>
                  {author.name}
                </InfoValue>
              ))
            ) : (
              <InfoValue>{SpecialStatus.Unknown}</InfoValue>
            )}
          </InfoRow>

          <InfoRow name={item.serializations.length > 1 ? 'Serializations' : 'Serialization'}>
            {item.serializations.length > 0 ? (
              item.serializations.map((obj) => <InfoValue key={obj.mal_id}>{obj.name}</InfoValue>)
            ) : (
              <InfoValue>{SpecialStatus.Unknown}</InfoValue>
            )}
          </InfoRow>

          {item.demographics.length > 0 && (
            <InfoRow name={item.demographics.length > 1 ? 'Demographics' : 'Demographic'}>
              {item.demographics.map((demographic) => (
                <InfoValue
                  key={demographic.mal_id}
                  isLink
                  to={mangaPaths.catalogWithParams({ genres: demographic.mal_id.toString() })}>
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
                  to={mangaPaths.catalogWithParams({ genres: genre.mal_id.toString() })}>
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
                <InfoValue
                  key={theme.mal_id}
                  isLink
                  to={mangaPaths.catalogWithParams({ genres: theme.mal_id.toString() })}>
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
