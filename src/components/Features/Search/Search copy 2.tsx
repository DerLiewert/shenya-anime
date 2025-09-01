import React from 'react';
import Select from 'react-select';
import debounce from 'lodash.debounce';
import { getAnimeSearch, getCharacterSearch, getMangaSearch } from '@/api';
import { getImageUrl, getShortAnimeRating, isEmpty } from '@/utils';
import { InfoRow, InfoValue, SearchIcon, Score, Status, AnimeTooltip } from '@/components';
import { Anime, Character, JikanPaginationPlus, Manga } from '@/models';
import { SpecialStatus } from '@/variables';
import './Search.scss';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';

type ItemTypes = Anime | Manga | Character;

type SearchData = (
  | { items: Anime[]; type: 'anime' }
  | { items: Manga[]; type: 'manga' }
  | { items: Character[]; type: 'character' }
) & { pagination: JikanPaginationPlus };

const searchTypeOptions = [
  { value: 'anime', label: 'Anime' },
  { value: 'manga', label: 'Manga' },
  { value: 'character', label: 'Character' },
] as const;

type SearchTypeOption = (typeof searchTypeOptions)[number];

const Search: React.FC<{ setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>> }> = ({
  setIsSearchOpen,
}) => {
  const location = useLocation();
  const controllersRef = React.useRef<AbortController>(null);
  const searchModalRef = React.useRef<HTMLDivElement>(null);
  const [portalTarget, setPortalTarget] = React.useState<HTMLElement | null>(null);

  const searchItems = useAppSelector(state => state.search)

  const [inputValue, setInputValue] = React.useState('');
  const [searchData, setSearchData] = React.useState<SearchData | null>(null);
  const [selectedType, setSelectedType] = React.useState<SearchTypeOption>(searchTypeOptions[0]);

  const updateSearchValue = React.useCallback(
    debounce((params, type, isMore = false) => {
      if (isEmpty(params.q)) {
        setSearchData(null);
        return;
      }

      let getItems = null;

      switch (type) {
        case 'anime':
          getItems = getAnimeSearch;
          break;
        case 'manga':
          getItems = getMangaSearch;
          break;
        case 'character':
          getItems = getCharacterSearch;
          break;
      }

      if (getItems) {
        getItems(params).then((res) => {
          controllersRef.current = null;
          setSearchData((prev) => ({
            type: type,
            items: isMore && prev ? [...prev.items, ...res.data] : (res.data as any),
            pagination: res.pagination as JikanPaginationPlus,
          }));
        });
      }
    }, 350),
    [selectedType],
  );

  React.useEffect(() => {
    if (searchModalRef.current) setPortalTarget(searchModalRef.current);

    const closeModal = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target === searchModalRef.current || target.closest('.search-item'))
        setIsSearchOpen(false);
    };

    document.addEventListener('click', closeModal);
    return () => {
      document.removeEventListener('click', closeModal);
    };
  }, []);

  React.useEffect(() => {
    updateSearchValue({ q: inputValue }, selectedType.value);
  }, [selectedType, inputValue]);

  return (
    <div className="search-modal">
      <div className="search-modal__inner" ref={searchModalRef}>
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
          <div className="search-modal__items">
            {!searchData || !searchData.items ? (
              <div className="search-modal__message">{`Enter a search term to find ${selectedType.value}.`}</div>
            ) : (
              searchData.items.length === 0 && (
                <div className="search-modal__message">{`No anime found matching "${inputValue}".`}</div>
              )
            )}
            {searchData?.items?.length &&
              searchData.type === 'anime' &&
              searchData.items.map((item) => (
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
                        <InfoValue>{item.type ? item.type : SpecialStatus.Unknown}</InfoValue>
                        {item.rating && (
                          <InfoValue isLinkPrimary>{getShortAnimeRating(item.rating)}</InfoValue>
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

            {searchData?.items?.length &&
              searchData.type === 'manga' &&
              searchData.items.map((item) => (
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
                        <InfoValue>{item.type ? item.type : SpecialStatus.Unknown}</InfoValue>
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

            {searchData?.items?.length &&
              searchData.type === 'character' &&
              searchData.items.map((item) => (
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
          </div>
          <button
            className="btn"
            onClick={() =>
              updateSearchValue(
                {
                  q: inputValue,
                  page: searchData && searchData.pagination.current_page + 1,
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
