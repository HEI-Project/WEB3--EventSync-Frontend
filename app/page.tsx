'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Event } from '@/lib/types';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { PageTransition } from '@/components/page-transition';

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.events
      .list()
      .then(setEvents)
      .catch((err) => console.error('[v0] Error loading events:', err))
      .finally(() => setLoading(false));
  }, []);

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
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-900">EventSync</h1>
              <p className="mt-2 text-gray-600">
                Découvrez et explorez nos événements
              </p>
            </motion.div>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {loading ? (
            <SkeletonLoader count={3} type="card" />
          ) : events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center"
            >
              <p className="text-gray-600">Aucun événement disponible</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {events.map((event, index) => (
                <motion.div key={event.id} variants={itemVariants}>
                  <Link href={`/events/${event.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className="h-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <h2 className="mb-2 text-xl font-bold text-gray-900">
                        {event.title}
                      </h2>
                      <p className="mb-4 text-gray-600 line-clamp-3">
                        {event.description}
                      </p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <p>
                          📍 {event.location}
                        </p>
                        <p>
                          📅{' '}
                          {new Date(event.startDate).toLocaleDateString(
                            'fr-FR'
                          )}
                        </p>
                        <p className="font-medium text-blue-600">
                          {event.sessions.length} sessions
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>

        {/* Footer navigation */}
        <footer className="border-t border-gray-200 bg-gray-50 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-4">
              <Link href="/speakers" className="text-blue-600 hover:text-blue-800">
                Intervenants
              </Link>
              <Link href="/rooms" className="text-blue-600 hover:text-blue-800">
                Salles
              </Link>
              <Link
                href="/admin/login"
                className="text-blue-600 hover:text-blue-800"
              >
                Admin
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
