'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { speakersApi } from '@/lib/api/speakers';
import { SpeakerLite } from '@/lib/types';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { ArrowRight, Users, ArrowLeft, Sparkles } from 'lucide-react';

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<SpeakerLite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    speakersApi
      .list()
      .then((data) => setSpeakers(data))
      .catch((err) => console.error('[v0] Error loading speakers:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-[300px] w-[400px] rounded-full bg-violet-500/8 blur-[100px]" />
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
            Experts et intervenants
          </motion.div>

          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Nos <span className="text-gradient">intervenants</span>
          </h1>
          <p className="mt-3 text-lg text-slate-400">
            Découvrez les experts qui animent nos événements.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonLoader count={6} type="card" />
          </div>
        ) : speakers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-glow rounded-2xl p-12 text-center"
          >
            <Users className="mx-auto h-12 w-12 text-slate-600 mb-4" />
            <p className="text-lg text-slate-400">Aucun intervenant disponible</p>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {speakers.map((speaker, index) => (
              <motion.div
                key={speaker.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              >
                <Link href={`/speakers/${speaker.id}`}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="card-glow group h-full rounded-2xl p-6 transition-all duration-300"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20 text-2xl font-bold text-cyan-400 mb-4">
                      {speaker.fullName.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="font-heading text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {speaker.fullName}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Intervenant
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-cyan-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Voir le profil
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
