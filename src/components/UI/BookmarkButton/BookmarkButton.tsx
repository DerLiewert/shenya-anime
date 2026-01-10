import { BookmarkIcon } from '@/components';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleBookmarkedItem } from '@/store';
import { AnimeAndMangaMap, AnimeAndMangaType } from '@/typescript';
import clsx from 'clsx';
import './BookmarkButton.scss';

interface BookmarkButtonProps<T extends AnimeAndMangaType> {
  type: T;
  item: AnimeAndMangaMap[T];
  withText?: boolean;
  className?: string;
  bookmarkedClassName?: string;
  noBookmarkedClassName?: string;
}

export const BookmarkButton = <T extends AnimeAndMangaType>({
  item,
  type,
  withText = true,
  className,
  bookmarkedClassName,
  noBookmarkedClassName,
}: BookmarkButtonProps<T>) => {
  const dispatch = useAppDispatch();
  const bookmarked = useAppSelector((state) => state.bookmark[type]);
  const isBookmarked = bookmarked[item.mal_id];

  return (
    <button
      className={clsx(className, {
        [bookmarkedClassName || '']: isBookmarked,
        [noBookmarkedClassName || '']: !isBookmarked,
        _bookmarked: isBookmarked,
      })}
      onClick={() => {
        dispatch(toggleBookmarkedItem({ type, item }));
      }}>
      <BookmarkIcon />
      {withText && <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>}
    </button>
  );
};
