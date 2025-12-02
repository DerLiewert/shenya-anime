// В трейлере может вместо картинки maximum_image_url быть серая заглушка от ютуб.
// Поэтому проверяем, если нет maximum_image_url или заглушка, то отображаем large_image_url если есть, иначе свою картинку not-found.jpg
import React from 'react';
import { AnimeYoutubeVideo } from '@/models';
import notFoundImage from '@/assets/not-found.jpg';

const isYoutubePlaceholder = (img: HTMLImageElement): boolean => {
  if (!img.src.includes('img.youtube.com')) return false;
  return img.naturalWidth === 120 && img.naturalHeight === 90;
};

export const useYoutubeTrailerImage = (item: AnimeYoutubeVideo | null | undefined) => {
  const [currentUrl, setCurrentUrl] = React.useState<string | null>(null);

  const isFallback = React.useMemo(() => currentUrl === notFoundImage, [currentUrl]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const images = React.useMemo(() => {
    if (!item) return null;
    if (item.images.maximum_image_url || item.images.large_image_url) return item.images;
    if (!item.embed_url) return null;

    const videoId = item.embed_url
      .replace('https://www.youtube-nocookie.com/embed/', '')
      .split('?')[0];

    return {
      maximum_image_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      large_image_url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    };
  }, [item]);

  React.useEffect(() => {
    setCurrentUrl(null);
  }, [item]);

  React.useEffect(() => {
    if (!item) return;

    if (!images) {
      setCurrentUrl(notFoundImage);
      return;
    }

    setCurrentUrl(images.maximum_image_url || images.large_image_url || notFoundImage);
  }, [images, item]);

  const onLoad = React.useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      const url = img.src;

      if (!images || url === notFoundImage) {
        setIsLoading(false);
        return;
      }

      // Если максимальное изображение загрузилось и не заглушка — всё ок
      if (url === images.maximum_image_url) {
        if (!isYoutubePlaceholder(img)) {
          setIsLoading(false);
          return;
        }
        if (images.large_image_url) {
          setCurrentUrl(images.large_image_url);
          return;
        }
      }

      // Иначе, если не пробовали fallback и есть large_image_url — переключаемся на него
      if (url === images.large_image_url && !isYoutubePlaceholder(img)) {
        setIsLoading(false);
        return;
      }

      // Если и large_image_url уже пробовали или нет — показываем заглушку
      setCurrentUrl(notFoundImage);
      setIsLoading(false);
    },
    [images],
  );

  const resetSrc = () => setCurrentUrl(null);

  return { src: currentUrl, onLoad, isFallback, isLoading, resetSrc };
};
