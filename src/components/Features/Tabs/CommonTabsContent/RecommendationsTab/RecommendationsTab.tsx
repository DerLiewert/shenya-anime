import React from 'react';
import { useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useFetchStatus, useShowMore } from '@/hooks';

import { EmptyValueMessage, Loading } from '@/components/UI';
import { RootState } from '@/app/store';
import { FetchStatus } from '@/types';
import { AsyncThunk } from '@reduxjs/toolkit';
import { Recommendation } from '@/models';
import './RecommendationsTab.scss';

type StatusSelector = (state: RootState) => FetchStatus | undefined;

interface RecommendationsTabProps {
  selector: (state: RootState) => Recommendation[];
  status: StatusSelector | FetchStatus | undefined;
  actionCreator: AsyncThunk<Recommendation[], any, { state: RootState; rejectValue: string }>;
  entityItem: (item: Recommendation, index: number) => React.ReactNode;
  visibleItemCount?: number;
  emptyValueMessage: string;
}


const RecommendationsTab = (props: RecommendationsTabProps) => {
  const {
    selector,
    status,
    actionCreator,
    emptyValueMessage,
    visibleItemCount = 12,
    entityItem,
  } = props;

  const recommendations = useAppSelector(selector);
  const { isLoading, isSuccess } = useFetchStatus(status);
  const { visibleCount, showMore } = useShowMore(visibleItemCount);

  useAbortableDispatch(
    actionCreator,
    undefined,
    recommendations.length === 0 && !isSuccess,
  );

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="anime-recommendations">
          {isSuccess && recommendations.length > 0 ? (
            <div className="anime-recommendations__items ">
              {recommendations.slice(0, visibleCount).map(entityItem)}
            </div>
          ) : (
            <EmptyValueMessage message={emptyValueMessage} />
          )}
          {recommendations.length > 0 && recommendations.length > visibleCount && (
            <div className="anime-recommendations__show-more-wrapper bnts-wrapper">
              <button
                className="anime-recommendations__show-more show-more-btn btn btn--upper btn--outline"
                onClick={showMore}
                disabled={isLoading}>
                Show more
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RecommendationsTab;
