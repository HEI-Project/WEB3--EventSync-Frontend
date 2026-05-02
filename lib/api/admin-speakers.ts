import { apiCall } from './client';
import type { Speaker } from '@/lib/types';

interface CreateSpeakerData {
  fullName: string;
  photoUrl: string;
  bio: string;
  externalLinks: string[];
}

export const adminSpeakersApi = {
  create: (data: CreateSpeakerData, token: string) =>
    apiCall<Speaker>('/admin/speakers', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),
  update: (id: string, data: CreateSpeakerData, token: string) =>
    apiCall<Speaker>(`/admin/speakers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),
  delete: (id: string, token: string) =>
    apiCall<void>(`/admin/speakers/${id}`, {
      method: 'DELETE',
      token,
    }),
};
