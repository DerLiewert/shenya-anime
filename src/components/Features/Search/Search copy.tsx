import React from 'react';
import Select from 'react-select';
import debounce from 'lodash.debounce';
import { getAnimeSearch, getCharacterSearch, getMangaSearch } from '@/api';
import { getImageUrl, getShortAnimeRating } from '@/utils';
import { Score, Status } from '@/components/UI';
import { InfoRow, InfoValue } from '@/components/Common';
import { Anime, Character, Manga } from '@/models';
import { SpecialStatus } from '@/variables';
import './Search.scss';

type ItemTypes = Anime | Manga | Character;
const searchTypeOptions = [
  { value: 'anime', label: 'Anime' },
  { value: 'manga', label: 'Manga' },
  { value: 'character', label: 'Character' },
] as const;

type SearchTypeOption = (typeof searchTypeOptions)[number];

function Search() {
  const searchModalRef = React.useRef<HTMLDivElement>(null);
  const [portalTarget, setPortalTarget] = React.useState<HTMLElement | null>(null);
  const [items, setItems] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<SearchTypeOption>(searchTypeOptions[0]);
  const [inputValue, setInputValue] = React.useState('');
  const controllersRef = React.useRef<AbortController>(null);

  const updateSearchValue = React.useCallback(
    debounce((value, type, controllersRef) => {
      setIsLoading(true);
      let getItems = null;

      switch (type.value) {
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
        const controller = new AbortController();
        controllersRef.current = controller;

        getItems({ q: value }, controller.signal).then((res) => {
          controllersRef.current = null;
          setItems(res.data);
          setIsLoading(false);
        });
      }
    }, 350),
    [selectedType],
  );

  React.useEffect(() => {
    if (searchModalRef.current) setPortalTarget(searchModalRef.current);
  }, []);

  React.useEffect(() => {
    if (controllersRef.current) {
      controllersRef.current.abort();
      controllersRef.current = null;
    }
    updateSearchValue(inputValue, selectedType, controllersRef);
  }, [selectedType, inputValue]);

  return (
    <div className="search-modal" ref={searchModalRef}>
      <div className="search-modal__inner">
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
            <div className="search-modal__field">
              <input
                className="search-modal__input"
                type="text"
                placeholder="Search..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              {/* <button className="search-modal__btn" aria-label="Search">
                <SearchIcon />
              </button> */}
            </div>
          </div>
          {!isLoading && (
            <div className="search-modal__items">
              {items?.length > 0 && selectedType.value === 'anime'
                ? items.map((item: Anime) => (
                    <div key={item.mal_id} className="search-modal__item search-item">
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
                    </div>
                  ))
                : selectedType.value === 'manga'
                ? items.map((item: Manga) => (
                    <div key={item.mal_id} className="search-modal__item search-item">
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
                    </div>
                  ))
                : selectedType.value === 'character' &&
                  items.map((item: Character) => (
                    <div key={item.mal_id} className="search-modal__item search-item">
                      <div className="search-item__image bg">
                        <img src={getImageUrl(item.images)} alt="Poster" aria-hidden />
                      </div>
                      <div className="search-item__content">
                        <div className="search-item__top">
                          <div className="search-item__title title">{item.name}</div>
                          <div className="search-item__title">{item.name_kanji}</div>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
