import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { FetchStatus } from '@/typescript';

type Status = FetchStatus | undefined | null;
type StatusSelector = (state: RootState) => Status;

export function useFetchStatus(statusOrSelector: StatusSelector | Status) {
  const selectedStatus = useAppSelector((state) =>
    typeof statusOrSelector === 'function' ? statusOrSelector(state) : undefined,
  );

  const status = typeof statusOrSelector === 'function' ? selectedStatus : statusOrSelector;

  return {
    isIdle: !status,
    isLoading: status === FetchStatus.LOADING,
    isSuccess: status === FetchStatus.SUCCESS,
    isError: status === FetchStatus.ERROR,
  };
}
