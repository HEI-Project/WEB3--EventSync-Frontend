import { apiCall } from './client';
import type { Room, SessionLite } from '@/lib/types';

interface RoomWithSessions extends Room {
  sessions?: SessionLite[];
}

export const roomsApi = {
  list: () => apiCall<RoomWithSessions[]>('/rooms'),
};
