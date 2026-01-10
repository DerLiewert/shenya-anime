import { PicturesTab } from '@/components';
import { characterEmptyValueMessages } from '@/constants';
import { fetchCharacterPictures } from '@/store';

export const CharacterPicturesTab = () => {
  return (
    <PicturesTab
      selector={(state) => state.characterFullById.pictures}
      status={(state) => state.characterFullById.status.pictures}
      emptyValueMessage={characterEmptyValueMessages.pictures}
      fetchAction={fetchCharacterPictures}
    />
  );
};
