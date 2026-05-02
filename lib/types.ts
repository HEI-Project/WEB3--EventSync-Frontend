export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  sessions: SessionLite[];
}

export interface Session {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  capacity: number;
  eventId: string;
  roomId: string;
  room: Room;
  speakers: Speaker[];
}

export interface SessionLite {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  room: Room;
  speakers: SpeakerLite[];
}

export interface Room {
  id: string;
  name: string;
  sessions?: SessionLite[];
}

export interface Speaker {
  id: string;
  fullName: string;
  photoUrl: string;
  bio: string;
  externalLinks: string[];
  sessions: SessionLite[];
}

export interface SpeakerLite {
  id: string;
  fullName: string;
}

export interface Question {
  id: string;
  content: string;
  authorName: string;
  upvoteCount: number;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}
