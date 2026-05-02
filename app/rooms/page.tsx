'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { roomsApi } from '@/lib/api/rooms';
import type { SessionLite } from '@/lib/types';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { PageTransition } from '@/components/page-transition';
import { SessionCard } from '@/components/session-card';

interface RoomWithSessions {
  id: string;
  name: string;
  sessions?: SessionLite[];
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomWithSessions[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  useEffect(() => {
    roomsApi
      .list()
      .then((data) => setRooms(data))
      .catch((err) => console.error('[v0] Error loading rooms:', err))
      .finally(() => setLoading(false));
  }, []);

  const displayedRoom = selectedRoom
    ? rooms.find((r) => r.id === selectedRoom)
    : rooms[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Salles</h1>
              <p className="mt-2 text-gray-600">
                Découvrez les sessions par salle
              </p>
            </motion.div>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {loading ? (
            <SkeletonLoader count={5} />
          ) : rooms.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center"
            >
              <p className="text-gray-600">Aucune salle disponible</p>
            </motion.div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-4">
              {/* Room list */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                <h2 className="mb-3 font-semibold text-gray-900">Salles</h2>
                <div className="space-y-2">
                  {rooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`w-full rounded-lg px-4 py-2 text-left font-medium transition-colors ${
                        selectedRoom === room.id || (!selectedRoom && rooms[0]?.id === room.id)
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {room.name}
                      <span className="ml-2 text-xs opacity-75">
                        ({room.sessions?.length || 0})
                      </span>
                    </button>
                  ))}
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
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">
                      {displayedRoom.name}
                    </h2>
                    {displayedRoom.sessions && displayedRoom.sessions.length > 0 ? (
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid gap-6 sm:grid-cols-2"
                      >
                        {displayedRoom.sessions.map((session, index) => (
                          <motion.div key={session.id} variants={itemVariants}>
                            <SessionCard session={session} index={index} />
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                        <p className="text-gray-600">
                          Aucune session dans cette salle
                        </p>
                      </div>
                    )}
                  </>
                ) : null}
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
}
