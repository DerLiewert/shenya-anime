import { RootState } from '@/app/store';
import { FetchStatus } from '../fetchStatus';

export type StatusSelector = (state: RootState) => FetchStatus | undefined | null;

export type ItemIdSelector = (state: RootState) => number | undefined;
