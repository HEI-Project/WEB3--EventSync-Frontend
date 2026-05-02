'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Speaker } from '@/lib/types';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { PageTransition } from '@/components/page-transition';
import { SessionCard } from '@/components/session-card';

export default function SpeakerDetailPage() {
  const params = useParams();
  const speakerId = params.id as string;
  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.speakers
      .get(speakerId)
      .then(setSpeaker)
      .catch((err) => console.error('[v0] Error loading speaker:', err))
      .finally(() => setLoading(false));
  }, [speakerId]);

  if (loading) return <SkeletonLoader count={3} />;
  if (!speaker) return <div className="p-8 text-center text-red-600">Intervenant non trouvé</div>;

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
            <Link href="/speakers" className="mb-4 inline-block text-blue-600 hover:text-blue-800">
              ← Retour
            </Link>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex gap-6"
            >
              {speaker.photoUrl && (
                <img
                  src={speaker.photoUrl}
                  alt={speaker.fullName}
                  className="h-32 w-32 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {speaker.fullName}
                </h1>
                <p className="mt-4 text-gray-600">{speaker.bio}</p>
                {speaker.externalLinks.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {speaker.externalLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Sessions ({speaker.sessions.length})
            </h2>
            {speaker.sessions.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                <p className="text-gray-600">
                  Cet intervenant n&apos;a pas encore de sessions
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid gap-6 sm:grid-cols-2"
              >
                {speaker.sessions.map((session, index) => (
                  <SessionCard key={session.id} session={session} index={index} />
                ))}
              </motion.div>
            )}
          </motion.section>
        </main>
      </div>
    </PageTransition>
  );
}
