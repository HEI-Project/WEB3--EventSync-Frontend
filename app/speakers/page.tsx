'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { SpeakerLite } from '@/lib/types';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { PageTransition } from '@/components/page-transition';

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<SpeakerLite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.speakers
      .list()
      .then((data) => setSpeakers(data))
      .catch((err) => console.error('[v0] Error loading speakers:', err))
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
            <Link href="/" className="mb-4 inline-block text-blue-600 hover:text-blue-800">
              ← Retour
            </Link>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-900">Intervenants</h1>
              <p className="mt-2 text-gray-600">
                Découvrez tous les intervenants de nos événements
              </p>
            </motion.div>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {loading ? (
            <SkeletonLoader count={6} type="card" />
          ) : speakers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center"
            >
              <p className="text-gray-600">Aucun intervenant disponible</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {speakers.map((speaker, index) => (
                <motion.div key={speaker.id} variants={itemVariants}>
                  <Link href={`/speakers/${speaker.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className="h-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-2xl font-bold text-white mb-4">
                        {speaker.fullName.charAt(0).toUpperCase()}
                      </div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {speaker.fullName}
                      </h2>
                      <p className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                        Voir le profil →
                      </p>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
      </div>
    </PageTransition>
  );
}
