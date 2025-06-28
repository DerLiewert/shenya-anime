import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import './Pagination.scss';

type Item = { value: number; isRerender: boolean; isEllipsis: boolean };

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onChangePage: (newPage: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = React.memo(
  ({ currentPage: current, totalItems, itemsPerPage, onChangePage, className }) => {
    const [pageItems, setPageItems] = useState<Array<Item>>([]);
    const [currentPage, setCurrentPage] = useState<Omit<Item, 'isEllipsis'>>({
      value: current,
      isRerender: false,
    });

    const lastPage = React.useMemo(() => {
      return Math.ceil(totalItems / itemsPerPage);
    }, [totalItems, itemsPerPage]);

    useEffect(() => {
      if (currentPage.value !== current) setCurrentPage({ value: current, isRerender: false });
    }, [current]);

    useEffect(() => {
      onChangePage(currentPage.value);
      if (currentPage.isRerender) setPageItems(setPagesArray(lastPage, currentPage.value, 4));
    }, [currentPage]);

    useEffect(() => {
      setPageItems(setPagesArray(lastPage, currentPage.value, 4));
    }, [lastPage]);

    const onPageClick = (e: React.MouseEvent<HTMLAnchorElement>, pageItem: Item) => {
      e.preventDefault();
      if (pageItem.value < 1 || pageItem.value > lastPage) return;

      setCurrentPage(pageItem);
      // if (pageItem.isRerender) setPageItems(setPagesArray(lastPage, pageItem.value, 4));
    };

    const [searchPage, setSearchPage] = useState<string>('');

    const goToSearchPage = () => {
      if (+searchPage === 0 || +searchPage === currentPage.value) return;
      setCurrentPage({ value: +searchPage, isRerender: true });
      setSearchPage('');
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && searchPage) goToSearchPage();
    };
    const onSearchPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      if (Number(value) > lastPage) value = String(lastPage);
      else if (value !== '' && Number(value) < 1) value = '1';

      setSearchPage(value);
    };

    if (lastPage <= 1) return null;

    return (
      <div className={clsx(className, 'pagination')}>
        <ul className="pagination__list">
          <li className="pagination__item pagination__item-prev">
            <a
              href="#"
              className="pagination__link"
              onClick={(e) => {
                const nextPage = pageItems.find((obj) => obj.value === currentPage.value - 1);
                if (nextPage) onPageClick(e, nextPage);
              }}>
              ←
            </a>
          </li>
          {pageItems.map((obj) => (
            <li className="pagination__item" key={obj.value}>
              <a
                href="#"
                className={'pagination__link ' + (currentPage.value === obj.value ? '_active' : '')}
                onClick={(e) => onPageClick(e, obj)}>
                {obj.isEllipsis ? '...' : obj.value}
              </a>
            </li>
          ))}
          <li className="pagination__item pagination__item-next">
            <a
              href="#"
              className="pagination__link"
              onClick={(e) => {
                const nextPage = pageItems.find((obj) => obj.value === currentPage.value + 1);
                if (nextPage) onPageClick(e, nextPage);
              }}>
              →
            </a>
          </li>
        </ul>
        <div className="pagination__search">
          <input
            placeholder="Page..."
            type="number"
            value={searchPage}
            onChange={onSearchPageChange}
            onKeyDown={handleKeyDown}
            className="pagination__link"
          />
          <button className="pagination__link" onClick={goToSearchPage}>
            Go
          </button>
        </div>
      </div>
    );
  },
);

const setPagesArray = (
  totalPage: number,
  currentPage: number,
  pageRangeDisplayed: number = 3,
): Item[] => {
  console.log('setPagesArray');

  if (pageRangeDisplayed < 3) pageRangeDisplayed = 3;

  // количество отображаемых элементов с номерами страниц
  const numberDisplayedItems = pageRangeDisplayed + 4; // +4 (2 - первая и последняя страница и 2 элемета с троеточием ...)

  const pageArr: Array<Item> = [];

  if (totalPage <= numberDisplayedItems) {
    for (let i = 1; i <= totalPage; i++) {
      pageArr.push({ value: i, isRerender: false, isEllipsis: false });
    }
    console.log('pageArr', pageArr);
    return pageArr;
  }

  if (currentPage < pageRangeDisplayed + 2) {
    for (let i = 1; i < pageRangeDisplayed + 2; i++) {
      pageArr.push({ value: i, isRerender: false, isEllipsis: false });
    }
    pageArr.push({ value: pageRangeDisplayed + 2, isRerender: true, isEllipsis: false });

    if (totalPage - pageRangeDisplayed > 2) {
      pageArr.push({ value: pageRangeDisplayed + 3, isRerender: true, isEllipsis: true });
      pageArr.push({ value: totalPage, isRerender: true, isEllipsis: false });
    } else {
      pageArr.push({ value: totalPage - 1, isRerender: false, isEllipsis: false });
      pageArr.push({ value: totalPage, isRerender: false, isEllipsis: false });
    }

    console.log('pageArr', pageArr);
    return pageArr;
  }

  if (currentPage > totalPage - (pageRangeDisplayed + 2) + 1) {
    if (currentPage === 2) {
      pageArr.push({ value: 1, isRerender: false, isEllipsis: false });
      pageArr.push({ value: currentPage, isRerender: false, isEllipsis: false });
      // pageArr.push(currentPage === 2 ? currentPage : 0);
    } else {
      pageArr.push({ value: 1, isRerender: true, isEllipsis: false });
      pageArr.push({
        value: totalPage - numberDisplayedItems + 2,
        isRerender: true,
        isEllipsis: true,
      });
    }

    for (let i = 3; i <= numberDisplayedItems; i++) {
      pageArr.push({
        value: totalPage - numberDisplayedItems + i,
        isRerender: i === 3,
        isEllipsis: false,
      });
    }
    // pageArr.push(totalPage);

    console.log('pageArr', pageArr);
    return pageArr;
  }

  //========================================================================================================================================================

  // номер элемента в списке для текущей страницы
  let numberCurrentItem = Math.ceil(numberDisplayedItems / 2);

  pageArr.push({ value: 1, isRerender: true, isEllipsis: false });
  pageArr.push({ value: currentPage - 2, isRerender: true, isEllipsis: true });

  for (let i = 3; i < numberCurrentItem; i++) {
    const numberItem = numberCurrentItem - i;
    const value = currentPage - numberItem;
    pageArr.push({ value: value, isRerender: i === 3, isEllipsis: false });
  }
  // pageArr.push(currentPage);
  pageArr.push({ value: currentPage, isRerender: false, isEllipsis: false });

  for (let i = numberCurrentItem + 1; i < numberDisplayedItems - 1; i++) {
    const numberItem = i;
    const value = numberItem - numberCurrentItem + currentPage;
    pageArr.push({
      value: value,
      isRerender: i + 1 === numberDisplayedItems - 1,
      isEllipsis: false,
    });
  }
  pageArr.push({
    value: numberDisplayedItems - 1 - numberCurrentItem + currentPage,
    isRerender: true,
    isEllipsis: true,
  });
  pageArr.push({ value: totalPage, isRerender: true, isEllipsis: false });

  console.log('pageArr', pageArr);
  return pageArr;
};

export default Pagination;
