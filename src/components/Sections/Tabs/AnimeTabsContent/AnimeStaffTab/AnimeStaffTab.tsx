import { AnimeStaff } from '@/typescript';
import { EntitiesTab, EntityTabItem } from '@/components';
import { animeEmptyValueMessages } from '@/constants';
import { fetchAnimeStaff } from '@/store';
import { appPaths } from '@/resources';
import './AnimeStaffTab.scss';

export const AnimeStaffTab = () => {
  return (
    <EntitiesTab<AnimeStaff>
      status={(state) => state.animeFullById.status.staff}
      emptyValueMessage={animeEmptyValueMessages.staff}
      selector={(state) => state.animeFullById.staff}
      fetchAction={fetchAnimeStaff}
      visibleItemCount={18}
      itemsBodyClass="tab-grid-2"
      items={(options) =>
        options.items
          .slice(0, options.visibleCount)
          .map((item) => (
            <EntityTabItem
              key={item.person.mal_id}
              linkUrl={appPaths.personFull(item.person.mal_id)}
              images={item.person.images}
              title={item.person.name}
              subtitles={item.positions}
            />
          ))
      }
    />
  );
};
