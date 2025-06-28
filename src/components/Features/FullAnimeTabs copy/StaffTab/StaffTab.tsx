import { useAppSelector } from '@/app/hooks';
import { EmptyValueMessage, Loading } from '@/components/UI';
import { useAbortableDispatch, useFetchStatus, useShowMore } from '@/hooks';
import { fetchAnimeStaff } from '@/store/anime/animeFullByIdSlice';
import { animeEmptyValueMessages } from '@/variables';
import React from 'react';
import { Link } from 'react-router-dom';
import './StaffTab.scss';

const StaffTab: React.FC<{ id: number }> = ({ id }) => {
  const { staff, status } = useAppSelector((state) => state.animeFullById);
  const { isLoading, isSuccess } = useFetchStatus(status.staff);
  const { visibleCount, showMore } = useShowMore(18);

  useAbortableDispatch(fetchAnimeStaff, id, staff.length === 0 && !isSuccess);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="anime-staff">
          {isSuccess && staff.length > 0 ? (
            <div className="anime-staff__items tab-grid-3">
              {staff.slice(0, visibleCount).map((item) => (
                <Link
                  key={item.person.mal_id}
                  to="#"
                  className="anime-staff__item staff-item border">
                  <div className="staff-item__image bg bg--dark">
                    <img
                      src={item.person.images.jpg.image_url}
                      alt="Person image"
                      loading="lazy"
                      aria-hidden
                    />
                  </div>
                  <div className="staff-item__content">
                    <h3 className="staff-item__name title visible-line">{item.person.name}</h3>
                    <div className="staff-item__positions">
                      {item.positions.map((position) => (
                        <p key={position}>{position}</p>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyValueMessage message={animeEmptyValueMessages.staff} />
          )}
          {staff.length > 0 && staff.length > visibleCount && (
            <div className="anime-staff__show-more-wrapper bnts-wrapper">
              <button
                className="anime-staff__show-more show-more-btn btn btn--upper btn--outline"
                onClick={showMore}>
                Show more
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default StaffTab;
