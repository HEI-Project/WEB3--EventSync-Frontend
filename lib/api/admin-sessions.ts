import { apiCall } from './client';
import type { Session } from '@/lib/types';

interface CreateSessionData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  capacity: number;
  eventId: string;
  roomId: string;
  speakerIds: string[];
}

export const adminSessionsApi = {
  list: () => apiCall<Session>(`/sessions/`),
    
  create: (data: CreateSessionData, token: string) =>
    apiCall<Session>('/admin/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),
  update: (id: string, data: CreateSessionData, token: string) =>
    apiCall<Session>(`/admin/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),
  delete: (id: string, token: string) =>
    apiCall<void>(`/admin/sessions/${id}`, {
      method: 'DELETE',
      token,
    }),
};
