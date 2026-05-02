'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { eventsApi } from '@/lib/api/events';
import { Event, SessionLite } from '@/lib/types';
import { SessionCard } from '@/components/session-card';
import { SkeletonLoader } from '@/components/skeleton-loader';
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Clock,
  Users,
  Zap,
} from 'lucide-react';

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

  if (loading) return <div className="min-h-screen pt-24 px-4"><SkeletonLoader count={5} /></div>;
  if (!event) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <Zap className="mx-auto h-16 w-16 text-cyan-400 mb-4" />
        <p className="text-xl text-slate-400">Événement non trouvé</p>
        <Link href="/" className="mt-4 inline-block text-cyan-400 hover:text-cyan-300">
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Header */}
      <section className="relative pt-24 pb-8 lg:pt-32 lg:pb-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {event.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-400">
              {event.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-400" />
                {event.location}
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-cyan-400" />
                {new Date(event.startDate).toLocaleDateString('fr-FR')} -{' '}
                {new Date(event.endDate).toLocaleDateString('fr-FR')}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-400" />
                {event.sessions?.length || 0} sessions
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Room filter */}
      {rooms.length > 1 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="mb-3 text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Filtrer par salle
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedRoom(null)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  selectedRoom === null
                    ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400'
                    : 'border border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                }`}
              >
                Toutes les salles
              </button>
              {rooms.map((room) => (
                <button
                  key={room}
                  onClick={() => setSelectedRoom(room)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    selectedRoom === room
                      ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400'
                      : 'border border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                  }`}
                >
                  {room}
                </button>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Sessions grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
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
            className="card-glow rounded-2xl p-12 text-center mt-8"
          >
            <Clock className="mx-auto h-12 w-12 text-slate-600 mb-4" />
            <p className="text-slate-400">Aucune session trouvée</p>
          </motion.div>
        )}
      </section>
    </div>
  );
}
