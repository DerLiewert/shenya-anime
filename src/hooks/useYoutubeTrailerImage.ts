/* 
  В трейлере вместо картинки может быть серая заглушка от ютуб.
  Поэтому проверяем, если нет maximum_image_url или large_image_url или вместо них заглушка, то отображаем свою картинку not-found.jpg
*/

import React from 'react';
import { AnimeYoutubeVideo } from '@/typescript';
import notFoundImage from '@/assets/bg/not-found.jpg';
import { getYoutubeImageUrls, isYoutubePlaceholder } from '@/utils';

export const useYoutubeTrailerImage = (item: AnimeYoutubeVideo | null | undefined) => {
  const [currentUrl, setCurrentUrl] = React.useState<string | null>(null);

  const isFallback = React.useMemo(() => currentUrl === notFoundImage, [currentUrl]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const images = React.useMemo(() => {
    if (!item) return null;
    if (item.images.maximum_image_url || item.images.large_image_url) return item.images;
    if (!item.embed_url) return null;

    // В один момент в самом API для AnimeYoutubeVideo все поля в images стали null.
    // Для решения проблемы было принято решение сформировать свой объект images с нужными полями
    return getYoutubeImageUrls(item.embed_url);
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

      // Если максимальное изображение загрузилось и это не заглушка — всё ок
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

      // Если не пробовали fallback и есть large_image_url — переключаемся на него
      if (url === images.large_image_url && !isYoutubePlaceholder(img)) {
        setIsLoading(false);
        return;
      }

      // Если и large_image_url уже пробовали или он null — показываем заглушку
      setCurrentUrl(notFoundImage);
      setIsLoading(false);
    },
    [images],
  );

  const resetSrc = () => setCurrentUrl(null);

  return { src: currentUrl, onLoad, isFallback, isLoading, resetSrc };
};
