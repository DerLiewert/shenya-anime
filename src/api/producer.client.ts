import { getResource } from './api.client';
import { ProducerFull, Producer, ProducerSearchParams } from '@/models';
import { ProducerEndpoints } from './endpoints/producer.endpoints';

export const getProducerFullById = (id: number, signal?: AbortSignal) => {
  return getResource<ProducerFull>({
    endpoint: ProducerEndpoints.producerFullById,
    pathParams: { id },
    signal,
  });
};

export const getProducerSearch = (queryParams: Partial<ProducerSearchParams>) => {
  return getResource<Producer[]>({ endpoint: ProducerEndpoints.producerSearch, queryParams });
};
