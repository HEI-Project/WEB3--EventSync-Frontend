import { apiCall } from './client';
import type { Room } from '@/lib/types';

interface RoomWithSessions extends Room {
  sessions?: any[];
}

export const roomsApi = {
  list: () => apiCall<RoomWithSessions[]>('/rooms'),
};
