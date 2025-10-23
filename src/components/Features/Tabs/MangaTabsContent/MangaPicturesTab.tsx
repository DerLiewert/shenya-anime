import React from 'react';
import { PicturesTab } from '@/components';
import { fetchMangaPictures } from '@/store/manga/mangaFullByIdSlice';
import { mangaEmptyValueMessages } from '@/constants';

const MangaPicturesTab: React.FC = () => {
  return (
    <PicturesTab
      selector={(state) => state.mangaFullById.pictures}
      status={(state) => state.mangaFullById.status.pictures}
      emptyValueMessage={mangaEmptyValueMessages.pictures}
      fetchAction={fetchMangaPictures}
    />
  );
};

export default MangaPicturesTab;
