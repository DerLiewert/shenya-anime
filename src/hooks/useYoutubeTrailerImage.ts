// В трейлере может вместо картинки maximum_image_url быть серая заглушка от ютуб.
// Поэтому проверяем, если нет maximum_image_url или заглушка, то отображаем large_image_url если есть, иначе свою картинку not-found.jpg
import { TrailerImagesCollection } from '@/models';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import notFoundImage from '@/assets/not-found.jpg';

const isYoutubePlaceholder = (img: HTMLImageElement): boolean => {
  if (!img.src.includes('img.youtube.com')) return false;
  return img.naturalWidth === 120 && img.naturalHeight === 90;
};

export const useYoutubeTrailerImage = (images: TrailerImagesCollection | null | undefined) => {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const isFallback = useMemo(() => currentUrl === notFoundImage, [currentUrl]);

  useEffect(() => {
    if (images) {
      setCurrentUrl(images.maximum_image_url || images.large_image_url || notFoundImage);
    }
  }, [images]);

  const onLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      const url = img.src;

      if (!images || url === notFoundImage) return;

      // Если максимальное изображение загрузилось и не заглушка — всё ок
      if (url === images.maximum_image_url) {
        if (!isYoutubePlaceholder(img)) return;
        if (images.large_image_url) {
          setCurrentUrl(images.large_image_url);
          return;
        }
      }

      // Иначе, если не пробовали fallback и есть large_image_url — переключаемся на него
      if (url === images.large_image_url && !isYoutubePlaceholder(img)) return;

      // Если и large_image_url уже пробовали или нет — показываем заглушку
      setCurrentUrl(notFoundImage);
    },
    [images],
  );

  const resetSrc = () => setCurrentUrl(null);

  return { src: currentUrl, onLoad, isFallback, resetSrc };
};
