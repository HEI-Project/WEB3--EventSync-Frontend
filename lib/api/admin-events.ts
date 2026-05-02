import { apiCall } from './client';
import type { Event } from '@/lib/types';

interface CreateEventData {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
}

export const adminEventsApi = {
  list: () => apiCall<Event[]>('/events'),
  get: (id: string) => apiCall<Event>(`/events/${id}`),
  create: (data: CreateEventData, token: string) =>
    apiCall<Event>('/admin/events', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),
  update: (id: string, data: CreateEventData, token: string) =>
    apiCall<Event>(`/admin/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),
  delete: (id: string, token: string) =>
    apiCall<void>(`/admin/events/${id}`, {
      method: 'DELETE',
      token,
    }),
};
