import React from 'react';
import { PicturesTab } from '@/components';
import { characterEmptyValueMessages } from '@/constants';
import { fetchCharacterPictures } from '@/store';

const CharacterPicturesTab: React.FC = () => {
  return (
    <PicturesTab
      selector={(state) => state.characterFullById.pictures}
      status={(state) => state.characterFullById.status.pictures}
      emptyValueMessage={characterEmptyValueMessages.pictures}
      fetchAction={fetchCharacterPictures}
    />
  );
};

export default CharacterPicturesTab;
