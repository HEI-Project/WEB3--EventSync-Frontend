import { apiCall } from './client';
import type { Session } from '@/lib/types';

export const sessionsApi = {
  get: (id: string) => apiCall<Session>(`/sessions/${id}`),
};
