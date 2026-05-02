import { apiCall } from './client';
import type { Speaker, SpeakerLite } from '@/lib/types';

export const speakersApi = {
  list: () => apiCall<SpeakerLite[]>('/speakers'),
  get: (id: string) => apiCall<Speaker>(`/speakers/${id}`),
};
