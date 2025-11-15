import React from 'react';
import { PicturesTab } from '@/components';
import { fetchMangaPictures } from '@/store/manga/mangaFullByIdSlice';
import { mangaEmptyValueMessages } from '@/constants';
import { useAppSelector } from '@/app/hooks';
import { isMangaNsfw } from '@/utils';

const MangaPicturesTab: React.FC = () => {
  const item = useAppSelector((state) => state.mangaFullById.item);
  return (
    <PicturesTab
      nsfw={item ? isMangaNsfw(item) : false}
      selector={(state) => state.mangaFullById.pictures}
      status={(state) => state.mangaFullById.status.pictures}
      emptyValueMessage={mangaEmptyValueMessages.pictures}
      fetchAction={fetchMangaPictures}
    />
  );
};

export default MangaPicturesTab;
