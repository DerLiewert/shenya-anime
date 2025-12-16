import React from 'react';
import { useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useFetchStatus, useShowMore } from '@/hooks';
import { EmptyValueMessage, Loading } from '@/components';

import type { RootState } from '@/app/store';
import type { AsyncThunk } from '@reduxjs/toolkit';
import type { Recommendation } from '@/typescript';
import type { AsyncThunkConfig, FetchStatus, StatusSelector } from '@/typescript';

import './RecommendationsTab.scss';
import { commonMessages } from '@/constants';

interface RecommendationsTabProps {
  selector: (state: RootState) => Recommendation[];
  status: StatusSelector | FetchStatus | undefined;
  fetchAction: AsyncThunk<Recommendation[], any, AsyncThunkConfig>;
  entityItem: (item: Recommendation, index: number) => React.ReactNode;
  visibleItemCount?: number;
  emptyValueMessage: string;
}

const RecommendationsTab = (props: RecommendationsTabProps) => {
  const {
    selector,
    status,
    fetchAction,
    emptyValueMessage,
    visibleItemCount = 12,
    entityItem,
  } = props;

  const abortableDispatch = useAbortableDispatch();
  const recommendations = useAppSelector(selector);
  const { isLoading, isSuccess, isError } = useFetchStatus(status);
  const { visibleCount, showMore } = useShowMore(visibleItemCount);

  React.useEffect(() => {
    if (recommendations.length === 0 && (!isSuccess || !isLoading)) abortableDispatch(fetchAction);
  }, []);

  return (
    <div className="recommendations">
      {recommendations.length > 0 && (
        <div className="recommendations__items">
          {recommendations.slice(0, visibleCount).map(entityItem)}
        </div>
      )}

      {isLoading && <Loading className="recommendations__message" />}
      {isError && (
        <EmptyValueMessage className="recommendations__message" message={commonMessages.error} />
      )}
      {isSuccess && recommendations.length === 0 && (
        <EmptyValueMessage className="recommendations__message" message={emptyValueMessage} />
      )}

      {recommendations.length > 0 && recommendations.length > visibleCount && (
        <div className="recommendations__show-more-wrapper bnts-wrapper">
          <button
            className="recommendations__show-more show-more-btn btn btn--upper btn--outline"
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
