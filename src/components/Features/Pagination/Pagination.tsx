import React from 'react';
import clsx from 'clsx';
import './Pagination.scss';

type PaginationItem = {
  value: number; // номер страницы
  isRerender: boolean /* Нужно ли создавать заново массив айтемов для пагинации при клике айтем. Пример:
    Не нужно: 1 ... 8 [9] 10 11 12 ... 99  -->  1 ... 8 9 [10] 11 12 ... 99                                    - переключились с 10 на 11
    Нужно: 1 ... 8 9 10 [11] 12 ... 99  -->  1 ... 8 9 10 11 [12] ... 99  -->  1 ... 11 [12] 13 14 15 ... 99   - переключились с 11 на 12
  */;
  isEllipsis?: boolean; // отображать троеточие вместо номера страницы
};

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onChangePage: (newPage: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage: current,
  totalItems,
  itemsPerPage,
  onChangePage,
  className,
}) => {
  const isFirstRender = React.useRef(true);
  const [pageItems, setPageItems] = React.useState<Array<PaginationItem>>([]);
  const [searchPage, setSearchPage] = React.useState<string>('');
  const [currentPage, setCurrentPage] = React.useState<Omit<PaginationItem, 'isEllipsis'>>({
    value: current,
    isRerender: false,
  });

  const lastPage = React.useMemo(
    () => Math.ceil(totalItems / itemsPerPage),
    [totalItems, itemsPerPage],
  );

  React.useEffect(() => {
    if (currentPage.value !== current) setCurrentPage({ value: current, isRerender: true });
  }, [current]);

  React.useEffect(() => {
    if (!isFirstRender.current) onChangePage(currentPage.value);
    if (currentPage.isRerender) setPageItems(setPagesArray(lastPage, currentPage.value, 4));
    isFirstRender.current = false;
  }, [currentPage]);

  React.useEffect(() => {
    setPageItems(setPagesArray(lastPage, currentPage.value, 4));
  }, [lastPage]);

  const onPageClick = (e: React.MouseEvent<HTMLAnchorElement>, pageItem: PaginationItem) => {
    e.preventDefault();
    if (pageItem.value < 1 || pageItem.value > lastPage) return;

    setCurrentPage(pageItem);
  };

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
};

const setPagesArray = (
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
      pageArr.push({ value: i, isRerender: false, isEllipsis: false });
    }
    return pageArr;
  }

  // Возвращается массив элементов с троеточием только для следующих страниц (1 2 3 [4] 5 ... 99), если currentPage почти в самом начале и для prev страни троеточие не нужно
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
    return pageArr;
  }

  // Возвращается массив элементов с троеточием только для предыдущих страниц (1 ... 95 [96] 97 98 99), если currentPage почти в самом конце и для next страни троеточие не нужно
  if (currentPage > totalPage - (pageRangeDisplayed + 2) + 1) {
    if (currentPage === 2) {
      pageArr.push({ value: 1, isRerender: false, isEllipsis: false });
      pageArr.push({ value: currentPage, isRerender: false, isEllipsis: false });
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
    return pageArr;
  }

  /*================================================================================================================================================ 
  Формирование массива элементов, если текущая страница где-то в середина и нужно отобразить троеточние и для предыдущих, и для следующих страниц
  ================================================================================================================================================*/

  // Порядковый номер элемента в списке для текущей страницы
  let numberCurrentItem = Math.ceil(numberDisplayedItems / 2);

  pageArr.push({ value: 1, isRerender: true, isEllipsis: false }); // Первая страница ( 1 )
  pageArr.push({ value: currentPage - 2, isRerender: true, isEllipsis: true }); // Троеточие после первой страницы для prev-страниц ( 1 ... )

  // Добавление сраниц после prev-троеточия и до текущей (до её порядкового номера numberCurrentItem) ( 1 ... 7 8 )
  for (let i = 3; i < numberCurrentItem; i++) {
    const numberItem = numberCurrentItem - i;
    const value = currentPage - numberItem;
    pageArr.push({ value: value, isRerender: i === 3, isEllipsis: false });
  }

  // Текущая страница (currentPage) ( 1 ... 7 8 [9] )
  pageArr.push({ value: currentPage, isRerender: false, isEllipsis: false });

  // Добавление сраниц после текущей и до next-троеточия ( 1 ... 7 8 [9] 10 11 )
  for (let i = numberCurrentItem + 1; i < numberDisplayedItems - 1; i++) {
    const numberItem = i;
    const value = numberItem - numberCurrentItem + currentPage;
    pageArr.push({
      value: value,
      isRerender: i + 1 === numberDisplayedItems - 1,
      isEllipsis: false,
    });
  }

  // Троеточие перед последней страницей для next-страниц ( 1 ... 7 8 [9] 10 11 ... )
  pageArr.push({
    value: numberDisplayedItems - 1 - numberCurrentItem + currentPage,
    isRerender: true,
    isEllipsis: true,
  });

  // Добавление последней страницы ( 1 ... 7 8 [9] 10 11 ... 99 )
  pageArr.push({ value: totalPage, isRerender: true, isEllipsis: false });

  return pageArr;
};

export default Pagination;
