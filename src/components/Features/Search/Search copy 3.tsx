import React from 'react';
import Select from 'react-select';
import debounce from 'lodash.debounce';
import { getImageUrl, getShortAnimeRating, isEmpty } from '@/utils';
import { InfoRow, InfoValue, SearchIcon, Score, Status, Loading } from '@/components';
import { SpecialStatus } from '@/variables';
import './Search.scss';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  fetchSearchAnime,
  fetchSearchCharacter,
  fetchSearchManga,
  resetState,
  SearchTypeMap,
} from '@/store/search/searchSlice';
import { useAbortableDispatch, useFetchStatus } from '@/hooks';
import { useInView } from 'react-intersection-observer';

const searchTypeOptions = [
  { value: 'anime', label: 'Anime' },
  { value: 'manga', label: 'Manga' },
  { value: 'character', label: 'Character' },
] as const;

type SearchTypeOption = (typeof searchTypeOptions)[number];

const Search: React.FC<{ setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>> }> = ({
  setIsSearchOpen,
}) => {
  const dispatch = useAppDispatch();
  const abortableDispatch = useAbortableDispatch();
  const search = useAppSelector((state) => state.search);
  const { isLoading, isSuccess } = useFetchStatus(search.status);

  const [inputValue, setInputValue] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<SearchTypeOption>(searchTypeOptions[0]);

  const modalRef = React.useRef<HTMLDivElement>(null);
  const modalInnerRef = React.useRef<HTMLDivElement>(null);
  const [portalTarget, setPortalTarget] = React.useState<HTMLElement | null>(null);

  const { ref, inView } = useInView({
    root: modalRef.current,
    threshold: 0,
    rootMargin: '0px 0px 150px 0px',
  });

  React.useEffect(() => {
    if (inView && search.pagination?.has_next_page) {
      updateSearchValue(
        {
          q: inputValue,
          page: search.pagination && search.pagination.current_page + 1,
        },
        selectedType.value,
        true,
      );
    }
  }, [inView]);

  const updateSearchValue = React.useCallback(
    debounce((params, type: keyof SearchTypeMap, isMore = false) => {
      switch (type) {
        case 'anime':
          abortableDispatch(fetchSearchAnime, params);
          break;
        case 'manga':
          abortableDispatch(fetchSearchManga, params);
          break;
        case 'character':
          abortableDispatch(fetchSearchCharacter, params);
          break;
      }
    }, 350),
    [selectedType],
  );

  React.useEffect(() => {
    if (modalInnerRef.current) setPortalTarget(modalInnerRef.current);

    const closeModal = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target === modalInnerRef.current || target.closest('.search-item'))
        setIsSearchOpen(false);
    };

    document.addEventListener('click', closeModal);
    return () => {
      document.removeEventListener('click', closeModal);
    };
  }, []);

  React.useEffect(() => {
    if (isEmpty(inputValue)) {
      updateSearchValue.cancel();
      abortableDispatch.abort();
      dispatch(resetState());
      return;
    }
    updateSearchValue({ q: inputValue }, selectedType.value);
  }, [selectedType, inputValue]);

  return (
    <div className="search-modal" ref={modalRef}>
      <div className="search-modal__inner" ref={modalInnerRef}>
        <div className="search-modal__body">
          <div className="search-modal__top">
            <Select
              className="search-modal__select select"
              classNamePrefix="select"
              placeholder="Select type..."
              defaultValue={searchTypeOptions[0]}
              value={selectedType}
              options={searchTypeOptions}
              onChange={(selected) => {
                if (selected) setSelectedType(selected);
              }}
              menuPortalTarget={portalTarget}
              isSearchable={false}
              unstyled
            />
            <label className="search-modal__field">
              <SearchIcon />
              <input
                className="search-modal__input"
                type="text"
                placeholder="Search..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </label>
          </div>
          <div className="search-modal__content">
            {
              // isLoading ? (
              //   <div className="search-modal__message">
              //     <Loading />
              //   </div>
              // ) :
              isSuccess ? (
                search.items.length === 0 ? (
                  <div className="search-modal__message">No results found</div>
                ) : (
                  <div className="search-modal__items">
                    {search.type === 'anime' &&
                      search.items.map((item, index, items) => (
                        <Link
                          to={`anime/${item.mal_id}`}
                          key={item.mal_id}
                          className="search-modal__item search-item">
                          <div className="search-item__image bg">
                            <img src={getImageUrl(item.images)} alt="Poster" aria-hidden />
                          </div>
                          <div className="search-item__content">
                            <div className="search-item__labels">
                              <Score
                                className="search-item__label search-item__label--score"
                                score={item.score}
                              />
                              <Status
                                className="search-item__label search-item__label--status"
                                status={item.status}
                              />
                            </div>
                            <div className="search-item__top">
                              <div className="search-item__title title">{item.title}</div>
                            </div>
                            <div className="search-item__info">
                              <InfoRow name="Type">
                                <InfoValue>
                                  {item.type ? item.type : SpecialStatus.Unknown}
                                </InfoValue>
                                {item.rating && (
                                  <InfoValue isLinkPrimary>
                                    {getShortAnimeRating(item.rating)}
                                  </InfoValue>
                                )}
                                {item.aired.prop.from.year && item.aired.prop.from.year}
                              </InfoRow>
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
                              {item.genres.length > 0 && (
                                <InfoRow name={item.genres.length > 1 ? 'Genres' : 'Genre'}>
                                  {item.genres.map((genre) => (
                                    <InfoValue key={genre.mal_id}>{genre.name}</InfoValue>
                                  ))}
                                </InfoRow>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}

                    {search.type === 'manga' &&
                      search.items.map((item) => (
                        <Link
                          to={`manga/${item.mal_id}`}
                          key={item.mal_id}
                          className="search-modal__item search-item">
                          <div className="search-item__image bg">
                            <img src={getImageUrl(item.images)} alt="Poster" aria-hidden />
                          </div>
                          <div className="search-item__content">
                            <div className="search-item__labels">
                              <Score
                                className="search-item__label search-item__label--score"
                                score={item.score}
                              />
                              <Status
                                className="search-item__label search-item__label--status"
                                status={item.status}
                              />
                            </div>
                            <div className="search-item__top">
                              <div className="search-item__title title">{item.title}</div>
                            </div>
                            <div className="search-item__info">
                              <InfoRow name="Type">
                                <InfoValue>
                                  {item.type ? item.type : SpecialStatus.Unknown}
                                </InfoValue>
                                {item.published.prop.from.year && item.published.prop.from.year}
                              </InfoRow>
                              {item.chapters && (
                                <InfoRow name="Chapters">
                                  <InfoValue>{item.chapters}</InfoValue>
                                </InfoRow>
                              )}
                              {item.genres.length > 0 && (
                                <InfoRow name={item.genres.length > 1 ? 'Genres' : 'Genre'}>
                                  {item.genres.map((genre) => (
                                    <InfoValue key={genre.mal_id}>{genre.name}</InfoValue>
                                  ))}
                                </InfoRow>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}

                    {search.type === 'character' &&
                      search.items.map((item) => (
                        <Link
                          to={`character/${item.mal_id}`}
                          key={item.mal_id}
                          className="search-modal__item search-item">
                          <div className="search-item__image bg">
                            <img src={getImageUrl(item.images)} alt="Poster" aria-hidden />
                          </div>
                          <div className="search-item__content">
                            <div className="search-item__top">
                              <div className="search-item__title title">{item.name}</div>
                              <div className="search-item__title">{item.name_kanji}</div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    <div ref={ref} style={{ height: 1 }} />
                  </div>
                )
              ) : (
                <div className="search-modal__message">{`Enter a search term to find ${selectedType.value}.`}</div>
              )
            }
          </div>
          <button
            className="btn"
            onClick={() =>
              updateSearchValue(
                {
                  q: inputValue,
                  page: search.pagination && search.pagination.current_page + 1,
                },
                selectedType.value,
                true,
              )
            }>
            Show more
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;
