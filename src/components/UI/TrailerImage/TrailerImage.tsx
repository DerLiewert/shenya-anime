import { useYoutubeTrailerImage } from '@/hooks';
import { AnimeYoutubeVideo } from '@/typescript';
import clsx from 'clsx';

interface TrailerImage {
  trailer: AnimeYoutubeVideo | null;
  className?: string;
  isFallbackClass?: boolean;
  isLoadingClass?: boolean;
}

export const TrailerImage = ({
  trailer,
  className,
  isFallbackClass = true,
  isLoadingClass = false,
}: TrailerImage) => {
  const { src, onLoad, isLoading, isFallback } = useYoutubeTrailerImage(trailer);

  const classes = clsx(className, {
    '_not-found': isFallbackClass && isFallback,
    _loading: isLoadingClass && isLoading,
  });

  return src ? (
    <img className={classes} src={src} onLoad={onLoad} alt="Background image" aria-hidden />
  ) : null;
};
