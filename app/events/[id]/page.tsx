'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { eventsApi } from '@/lib/api/events';
import { Event, SessionLite } from '@/lib/types';
import { SessionCard } from '@/components/session-card';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { PageTransition } from '@/components/page-transition';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  useEffect(() => {
    eventsApi
      .get(eventId)
      .then((data) => {
        setEvent(data);
        const stored = localStorage.getItem('favorites');
        if (stored) {
          setFavorites(new Set(JSON.parse(stored)));
        }
      })
      .catch((err) => console.error('[v0] Error loading event:', err))
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleAddFavorite = (sessionId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(sessionId)) {
      newFavorites.delete(sessionId);
    } else {
      newFavorites.add(sessionId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
  };

  const isSessionLive = (session: SessionLite): boolean => {
    const now = new Date();
    return new Date(session.startTime) <= now && now <= new Date(session.endTime);
  };

  const rooms = event
    ? Array.from(new Set(event.sessions?.map((s) => s.room?.name).filter(Boolean)))
    : [];

  const filteredSessions = event
    ? selectedRoom
      ? event.sessions?.filter((s) => s.room?.name === selectedRoom) || []
      : event.sessions || []
    : [];

  if (loading) return <SkeletonLoader count={5} />;
  if (!event) return <div className="p-8 text-center text-red-600">Événement non trouvé</div>;

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Link href="/" className="mb-4 inline-block text-blue-600 hover:text-blue-800">
              ← Retour
            </Link>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
              <p className="mt-2 text-gray-600">{event.description}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                <span>📍 {event.location}</span>
                <span>
                  📅{' '}
                  {new Date(event.startDate).toLocaleDateString('fr-FR')} -{' '}
                  {new Date(event.endDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Room filter */}
          {rooms.length > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <h2 className="mb-3 font-semibold text-gray-900">Filtrer par salle</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedRoom(null)}
                  className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                    selectedRoom === null
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Toutes les salles
                </button>
                {rooms.map((room) => (
                  <button
                    key={room}
                    onClick={() => setSelectedRoom(room)}
                    className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                      selectedRoom === room
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {room}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Sessions grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredSessions.map((session, index) => (
              <SessionCard
                key={session.id}
                session={session}
                isLive={isSessionLive(session)}
                onAddFavorite={handleAddFavorite}
                isFavorite={favorites.has(session.id)}
                index={index}
              />
            ))}
          </motion.div>

          {filteredSessions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center"
            >
              <p className="text-gray-600">Aucune session trouvée</p>
            </motion.div>
          )}
        </main>
      </div>
    </PageTransition>
  );
}
