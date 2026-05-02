import { apiCall } from './client';
import type { Room, SessionLite } from '@/lib/types';

interface CreateRoomData {
  name: string;
}

interface RoomWithSessions extends Room {
  sessions?: SessionLite[];
}

export const adminRoomsApi = {
  list: () => apiCall<RoomWithSessions[]>('/rooms'),
  create: (data: CreateRoomData, token: string) =>
    apiCall<Room>('/admin/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),
  update: (id: string, data: CreateRoomData, token: string) =>
    apiCall<Room>(`/admin/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),
  delete: (id: string, token: string) =>
    apiCall<void>(`/admin/rooms/${id}`, {
      method: 'DELETE',
      token,
    }),
};
