'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { roomsApi } from '@/lib/api/rooms';
import type { SessionLite } from '@/lib/types';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { SessionCard } from '@/components/session-card';
import { ArrowLeft, Building2, Sparkles, MapPin } from 'lucide-react';

interface RoomItem {
  id: string;
  name: string;
  sessions?: SessionLite[];
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  useEffect(() => {
    roomsApi
      .list()
      .then((data) => setRooms(data))
      .catch((err) => console.error('Error loading rooms:', err))
      .finally(() => setLoading(false));
  }, []);

  const displayedRoom = selectedRoom
    ? rooms.find((r) => r.id === selectedRoom)
    : rooms[0];

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-125 w-200 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-75 w-100 rounded-full bg-violet-500/8 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-sm text-cyan-400"
          >
            <Sparkles className="h-4 w-4" />
            Lieux et espaces
          </motion.div>

          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Nos <span className="text-gradient">salles</span>
          </h1>
          <p className="mt-3 text-lg text-slate-400">
            Explorez les sessions organisées par salle.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonLoader count={5} type="card" />
          </div>
        ) : rooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-glow rounded-2xl p-12 text-center"
          >
            <Building2 className="mx-auto h-12 w-12 text-slate-600 mb-4" />
            <p className="text-lg text-slate-400">Aucune salle disponible</p>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Room list sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="glass-strong rounded-2xl p-4">
                <h2 className="mb-3 text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Salles
                </h2>
                <div className="space-y-2">
                  {rooms.map((room) => (
                    <motion.button
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-all ${
                        selectedRoom === room.id || (!selectedRoom && rooms[0]?.id === room.id)
                          ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400'
                          : 'border border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {room.name}
                        </span>
                        <span className="text-xs text-slate-600">
                          {room.sessions?.length || 0}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Room sessions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3"
            >
              {displayedRoom ? (
                <>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20">
                      <MapPin className="h-5 w-5 text-cyan-400" />
                    </div>
                    <h2 className="font-heading text-xl font-bold text-white">
                      {displayedRoom.name}
                    </h2>
                  </div>

                  {displayedRoom.sessions && displayedRoom.sessions.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2">
                      {displayedRoom.sessions.map((session, index) => (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <SessionCard session={session} index={index} />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="card-glow rounded-2xl p-8 text-center">
                      <p className="text-slate-400">
                        Aucune session dans cette salle
                      </p>
                    </div>
                  )}
                </>
              ) : null}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
