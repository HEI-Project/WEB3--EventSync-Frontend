import { apiCall } from './client';
import type { Session } from '@/lib/types';

export const sessionsApi = {
  list: () => apiCall<Session[]>('/sessions'),
  get: (id: string) => apiCall<Session>(`/sessions/${id}`),
};
