import React from 'react';
import { RootState } from '@/app/store';
import { useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useFetchStatus, useShowMore } from '@/hooks';
import { AsyncThunkConfig, FetchStatus, StatusSelector } from '@/typescript';
import { AsyncThunk } from '@reduxjs/toolkit';
import { Recommendation } from '@/models';

import { EmptyValueMessage, Loading } from '@/components/UI';
import './RecommendationsTab.scss';

interface RecommendationsTabProps {
  selector: (state: RootState) => Recommendation[];
  status: StatusSelector | FetchStatus | undefined;
  actionCreator: AsyncThunk<Recommendation[], any, AsyncThunkConfig>;
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

  const abortableDispatch = useAbortableDispatch();
  const recommendations = useAppSelector(selector);
  const { isLoading, isSuccess } = useFetchStatus(status);
  const { visibleCount, showMore } = useShowMore(visibleItemCount);

  React.useEffect(() => {
    if (recommendations.length === 0 && !isSuccess) abortableDispatch(actionCreator);
  }, []);

  if (isLoading) return <Loading />;

  return (
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
  );
};

export default RecommendationsTab;
