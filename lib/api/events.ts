import { apiCall } from './client';
import type { Event } from '@/lib/types';

export const eventsApi = {
  list: () => apiCall<Event[]>('/events'),
  get: (id: string) => apiCall<Event>(`/events/${id}`),
};
