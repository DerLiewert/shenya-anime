import React from 'react';
import Select from 'react-select';
import debounce from 'lodash.debounce';
import { useInView } from 'react-intersection-observer';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useFetchStatus } from '@/hooks';
import { SearchIcon, Loading } from '@/components';
import { isEmpty } from '@/utils';
import {
  fetchSearchAnime,
  fetchSearchCharacter,
  fetchSearchManga,
  resetSearchState,
  SearchTypeMap,
  setSearchValue,
} from '@/store/search/searchSlice';
import { SearchAnimeItem, SearchCharacterItem, SearchMangaItem } from './Items';
import { commonMessages, searchTypeOptions } from '@/variables';
import './Search.scss';

type SearchTypeOption = (typeof searchTypeOptions)[number];

const Search: React.FC<{ onSearchClose: () => void }> = ({ onSearchClose }) => {
  const dispatch = useAppDispatch();
  const abortableDispatch = useAbortableDispatch();
  const { items, pagination, status, type, value } = useAppSelector((state) => state.search);
  const { isIdle, isLoading, isSuccess, isError } = useFetchStatus(status);

  const [inputValue, setInputValue] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<SearchTypeOption>(searchTypeOptions[0]);

  const modalRef = React.useRef<HTMLDivElement>(null);
  const modalInnerRef = React.useRef<HTMLDivElement>(null);

  const { ref, inView } = useInView({
    root: modalRef.current,
    threshold: 0,
    rootMargin: '0px 0px 200px 0px',
  });

  const fetchItems = React.useCallback(
    debounce((type: keyof SearchTypeMap, params) => {
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

  // Закрытие модального окна
  React.useEffect(() => {
    const closeModal = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target === modalInnerRef.current || target.closest('.search-item')) onSearchClose();
    };

    document.addEventListener('click', closeModal);
    return () => {
      dispatch(resetSearchState());
      document.removeEventListener('click', closeModal);
    };
  }, []);

  // Подгружаем ещё партию айтемов если доскролили вниз (если они есть)
  React.useEffect(() => {
    if (inView && pagination?.has_next_page) {
      dispatch(setSearchValue(inputValue));
      fetchItems(selectedType.value, {
        q: inputValue,
        page: pagination && pagination.current_page + 1,
      });
    }
  }, [inView]);

  // Получение данных или очистка state при пустом значении
  React.useEffect(() => {
    onSearchDataChange();
  }, [selectedType, inputValue]);

  const onSearchDataChange = () => {
    if (isEmpty(inputValue)) {
      fetchItems.cancel();
      abortableDispatch.abort();
      dispatch(resetSearchState());
      return;
    }
    if (selectedType.value !== type) abortableDispatch.abort();
    fetchItems(selectedType.value, { q: inputValue });
  };

  return (
    <div className="search-modal" ref={modalRef}>
      <div className="search-modal__inner" ref={modalInnerRef}>
        <button className="search-modal__close" onClick={onSearchClose}></button>
        <div className="search-modal__body ">
          <div className="search-modal__top">
            <Select
              className="search-modal__select select fz-16"
              classNamePrefix="select"
              placeholder="Select type..."
              defaultValue={searchTypeOptions[0]}
              value={selectedType}
              options={searchTypeOptions}
              onChange={(selected) => {
                if (selected) setSelectedType(selected);
              }}
              isSearchable={false}
              unstyled
            />
            <label className="search-modal__field">
              <SearchIcon />
              <input
                className="search-modal__input fz-16"
                type="text"
                placeholder="Search..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isError) onSearchDataChange();
                }}
              />
              {inputValue && (
                <button
                  className="search-modal__close-btn"
                  onClick={() => setInputValue('')}></button>
              )}
            </label>
          </div>
          <div className="search-modal__content">
            {isIdle ? (
              <div className="search-modal__message fz-16">
                Enter a search term to find {selectedType.value}.
              </div>
            ) : isError ? (
              <div className="search-modal__message fz-16">{commonMessages.error}</div>
            ) : isSuccess && items.length === 0 ? (
              <div className="search-modal__message fz-16">No results found.</div>
            ) : isLoading && inputValue !== value ? (
              <div className="search-modal__message fz-16">
                <Loading />
              </div>
            ) : (
              <>
                <div className="search-modal__items">
                  {type === 'anime' &&
                    items.map((item) => <SearchAnimeItem key={item.mal_id} item={item} />)}

                  {type === 'manga' &&
                    items.map((item) => <SearchMangaItem key={item.mal_id} item={item} />)}

                  {type === 'character' &&
                    items.map((item) => <SearchCharacterItem key={item.mal_id} item={item} />)}

                  <div ref={ref} style={{ height: 1 }} />
                </div>
                {isLoading && (
                  <div className="search-modal__message">
                    <Loading />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
