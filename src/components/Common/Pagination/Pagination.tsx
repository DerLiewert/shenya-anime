import React from 'react';
import clsx from 'clsx';
import './Pagination.scss';
import { isEmptyApp } from '@/utils';

type PaginationItem = {
  value: number; // номер страницы
  isEllipsis?: boolean; // отображать троеточие вместо номера страницы
};

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onChangePage: (newPage: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onChangePage,
  className,
}) => {
  const lastPage = React.useMemo(
    () => Math.ceil(totalItems / itemsPerPage),
    [totalItems, itemsPerPage],
  );

  const [searchPage, setSearchPage] = React.useState<number | undefined>(undefined);
  const paginationItems = React.useMemo<Array<PaginationItem>>(
    () => createPaginationItems(lastPage, currentPage, 4),
    [lastPage, currentPage],
  );

  const onPageClick = (e: React.MouseEvent<HTMLButtonElement>, value: number) => {
    e.preventDefault();

    if (value < 1 || value > lastPage || value === currentPage) return;
    onChangePage(value);
  };

  const goToSearchPage = () => {
    if (!searchPage || searchPage === currentPage) return;
    onChangePage(searchPage);
    setSearchPage(undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') goToSearchPage();
  };

  const onSearchPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);

    if (isEmptyApp(e.target.value) || isNaN(value)) setSearchPage(undefined);
    else if (value < 1) setSearchPage(1);
    else if (value > lastPage) setSearchPage(lastPage);
    else setSearchPage(value);
  };

  if (lastPage <= 1) return null;

  return (
    <div className={clsx(className, 'pagination')}>
      <ul className="pagination__list">
        <li className="pagination__item pagination__item-prev">
          <button
            className="pagination__btn"
            onClick={(e) => {
              onPageClick(e, currentPage - 1);
            }}
            disabled={currentPage === 1}>
            ←
          </button>
        </li>
        {paginationItems.map((obj) => (
          <li className="pagination__item" key={`${obj.value}_${obj.isEllipsis}`}>
            <button
              className={'pagination__btn ' + (currentPage === obj.value ? '_active' : '')}
              onClick={(e) => onPageClick(e, obj.value)}>
              {obj.isEllipsis ? '...' : obj.value}
            </button>
          </li>
        ))}
        <li className="pagination__item pagination__item-next">
          <button
            className="pagination__btn"
            onClick={(e) => {
              onPageClick(e, currentPage + 1);
            }}
            disabled={currentPage === lastPage}>
            →
          </button>
        </li>
      </ul>
      <div className="pagination__search">
        <input
          placeholder="Page..."
          type="number"
          value={searchPage ?? ''}
          onChange={onSearchPageChange}
          onKeyDown={handleKeyDown}
          className="pagination__btn"
        />
        <button className="pagination__btn" onClick={goToSearchPage}>
          Go
        </button>
      </div>
    </div>
  );
};

//======================================
//======= createPaginationItems ========
//======================================
const createPaginationItems = (
  totalPage: number,
  currentPage: number,
  pageRangeDisplayed: number = 3, // количество отображаемых страниц между троеточиями  1 ... 7 8 9 ... 99 (мин. значение 3)
): PaginationItem[] => {
  // 3 - минимальное значение ( 1 2 3 4 5 ... 99  /  1 ... 7 8 9 ... 99  /  1 ... 95 96 97 98 99 )
  if (pageRangeDisplayed < 3) pageRangeDisplayed = 3;

  // количество отображаемых элементов с номерами страниц
  const numberDisplayedItems = pageRangeDisplayed + 4; // +4 это первая и последняя страница, и 2 элемета с троеточием "..." (всегда минимум отображаться будет 7 элементов)

  // Массив элементов пагинации
  const pageArr: Array<PaginationItem> = [];

  // Если общее количество страниц <= numberDisplayedItems, то возвращаются только страницы с номерами (1 2 3 4 5 6 7)
  if (totalPage <= numberDisplayedItems) {
    for (let i = 1; i <= totalPage; i++) {
      pageArr.push({ value: i, isEllipsis: false });
    }
    return pageArr;
  }

  // Возвращается массив элементов с троеточием только для следующих страниц (1 2 3 [4] 5 ... 99), если currentPage почти в самом начале и для prev страни троеточие не нужно
  if (currentPage < pageRangeDisplayed + 2) {
    for (let i = 1; i < pageRangeDisplayed + 2; i++) {
      pageArr.push({ value: i, isEllipsis: false });
    }
    pageArr.push({ value: pageRangeDisplayed + 2, isEllipsis: false });

    if (totalPage - pageRangeDisplayed > 2) {
      pageArr.push({ value: pageRangeDisplayed + 3, isEllipsis: true });
      pageArr.push({ value: totalPage, isEllipsis: false });
    } else {
      pageArr.push({ value: totalPage - 1, isEllipsis: false });
      pageArr.push({ value: totalPage, isEllipsis: false });
    }
    return pageArr;
  }

  // Возвращается массив элементов с троеточием только для предыдущих страниц (1 ... 95 [96] 97 98 99), если currentPage почти в самом конце и для next страни троеточие не нужно
  if (currentPage > totalPage - (pageRangeDisplayed + 2) + 1) {
    if (currentPage === 2) {
      pageArr.push({ value: 1, isEllipsis: false });
      pageArr.push({ value: currentPage, isEllipsis: false });
    } else {
      pageArr.push({ value: 1, isEllipsis: false });
      pageArr.push({
        value: totalPage - numberDisplayedItems + 2,
        isEllipsis: true,
      });
    }

    for (let i = 3; i <= numberDisplayedItems; i++) {
      pageArr.push({
        value: totalPage - numberDisplayedItems + i,
        isEllipsis: false,
      });
    }
    return pageArr;
  }

  /*================================================================================================================================================ 
  Формирование массива элементов, если текущая страница где-то в середина и нужно отобразить троеточние и для предыдущих, и для следующих страниц
  ================================================================================================================================================*/

  // Порядковый номер элемента в списке для текущей страницы
  let numberCurrentItem = Math.ceil(numberDisplayedItems / 2);

  pageArr.push({ value: 1, isEllipsis: false }); // Первая страница ( 1 )
  pageArr.push({ value: currentPage - 2, isEllipsis: true }); // Троеточие после первой страницы для prev-страниц ( 1 ... )

  // Добавление сраниц после prev-троеточия и до текущей (до её порядкового номера numberCurrentItem) ( 1 ... 7 8 )
  for (let i = 3; i < numberCurrentItem; i++) {
    const numberItem = numberCurrentItem - i;
    const value = currentPage - numberItem;
    pageArr.push({ value: value, isEllipsis: false });
  }

  // Текущая страница (currentPage) ( 1 ... 7 8 [9] )
  pageArr.push({ value: currentPage, isEllipsis: false });

  // Добавление сраниц после текущей и до next-троеточия ( 1 ... 7 8 [9] 10 11 )
  for (let i = numberCurrentItem + 1; i < numberDisplayedItems - 1; i++) {
    const numberItem = i;
    const value = numberItem - numberCurrentItem + currentPage;
    pageArr.push({
      value: value,
      isEllipsis: false,
    });
  }

  // Троеточие перед последней страницей для next-страниц ( 1 ... 7 8 [9] 10 11 ... )
  pageArr.push({
    value: numberDisplayedItems - 1 - numberCurrentItem + currentPage,
    isEllipsis: true,
  });

  // Добавление последней страницы ( 1 ... 7 8 [9] 10 11 ... 99 )
  pageArr.push({ value: totalPage, isEllipsis: false });

  return pageArr;
};
