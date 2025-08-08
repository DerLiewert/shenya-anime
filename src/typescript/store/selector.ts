import { RootState } from '@/app/store';
import { FetchStatus } from '../fetchStatus';

export type StatusSelector = (state: RootState) => FetchStatus | undefined;

export type IdSelector = (state: RootState) => number | undefined;
