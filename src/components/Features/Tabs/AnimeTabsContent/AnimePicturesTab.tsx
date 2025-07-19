import React from 'react';
import { fetchAnimePictures } from '@/store/anime/animeFullByIdSlice';
import { PicturesTab } from '../CommonTabsContent/PicturesTab';
import { animeEmptyValueMessages } from '@/variables';

const AnimePicturesTab: React.FC = () => {
  return (
    <PicturesTab
      selector={(state) => state.animeFullById.pictures}
      status={(state) => state.animeFullById.status.pictures}
      emptyValueMessage={animeEmptyValueMessages.pictures}
      actionCreator={fetchAnimePictures}
    />
  );
};

export default AnimePicturesTab;
