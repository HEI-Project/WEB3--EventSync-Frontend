export { apiCall } from './client';
export type { ApiOptions } from './client';

export { eventsApi } from './events';
export { sessionsApi } from './sessions';
export { questionsApi } from './questions';
export { speakersApi } from './speakers';
export { roomsApi } from './rooms';
export { authApi } from './auth';
export { adminEventsApi } from './admin-events';
export { adminSessionsApi } from './admin-sessions';
export { adminSpeakersApi } from './admin-speakers';
export { adminRoomsApi } from './admin-rooms';

import { eventsApi } from './events';
import { sessionsApi } from './sessions';
import { questionsApi } from './questions';
import { speakersApi } from './speakers';
import { roomsApi } from './rooms';
import { authApi } from './auth';
import { adminEventsApi } from './admin-events';
import { adminSessionsApi } from './admin-sessions';
import { adminSpeakersApi } from './admin-speakers';
import { adminRoomsApi } from './admin-rooms';

export const api = {
  events: eventsApi,
  sessions: sessionsApi,
  questions: questionsApi,
  speakers: speakersApi,
  rooms: roomsApi,
};

export const adminApi = {
  auth: authApi,
  events: adminEventsApi,
  sessions: adminSessionsApi,
  speakers: adminSpeakersApi,
  rooms: adminRoomsApi,
};
