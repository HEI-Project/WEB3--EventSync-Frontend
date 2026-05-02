import { apiCall } from './client';
import type { Room } from '@/lib/types';

interface CreateRoomData {
  name: string;
}

export const adminRoomsApi = {
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
