import { fetchPersonPictures } from '@/store';
import { personEmptyValueMessages } from '@/constants';
import { PicturesTab } from '@/components';

export const PersonPicturesTab = () => {
  return (
    <PicturesTab
      selector={(state) => state.personFullById.pictures}
      status={(state) => state.personFullById.status.pictures}
      emptyValueMessage={personEmptyValueMessages.pictures}
      fetchAction={fetchPersonPictures}
    />
  );
};
