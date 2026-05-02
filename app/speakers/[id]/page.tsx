'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { speakersApi } from '@/lib/api/speakers';
import { Speaker } from '@/lib/types';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { SessionCard } from '@/components/session-card';
import { ArrowLeft, Users, ExternalLink, Zap, Sparkles } from 'lucide-react';

export default function SpeakerDetailPage() {
  const params = useParams();
  const speakerId = params.id as string;
  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    speakersApi
      .get(speakerId)
      .then((data) => setSpeaker(data))
      .catch((err) => console.error('[v0] Error loading speaker:', err))
      .finally(() => setLoading(false));
  }, [speakerId]);

  if (loading) return (
    <div className="min-h-screen bg-background bg-grid pt-24 px-4">
      <div className="mx-auto max-w-4xl px-4">
        <SkeletonLoader count={3} />
      </div>
    </div>
  );

  if (!speaker) return (
    <div className="min-h-screen bg-background bg-grid pt-24 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="mb-6 inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20">
          <Zap className="h-10 w-10 text-cyan-400" />
        </div>
        <p className="text-xl text-slate-400">Intervenant non trouvé</p>
        <Link href="/speakers" className="mt-6 inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Retour aux intervenants
        </Link>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32">
        <Link href="/speakers" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Intervenants
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glow rounded-2xl p-6 sm:p-8 mb-12"
        >
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border border-cyan-500/20 text-4xl font-bold text-cyan-400">
              {speaker.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                {speaker.fullName}
              </h1>

              {speaker.bio && (
                <p className="mt-4 text-slate-400 leading-relaxed">{speaker.bio}</p>
              )}

              {speaker.externalLinks && speaker.externalLinks.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {speaker.externalLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-2 text-sm text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Lien {i + 1}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20">
              <Users className="h-5 w-5 text-cyan-400" />
            </div>
            <h2 className="font-heading text-xl font-bold text-white">
              Sessions ({speaker.sessions?.length || 0})
            </h2>
          </div>

          {(!speaker.sessions || speaker.sessions.length === 0) ? (
            <div className="card-glow rounded-2xl p-8 text-center">
              <p className="text-slate-400">
                Cet intervenant n'a pas encore de sessions
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {speaker.sessions.map((session, index) => (
                <SessionCard key={session.id} session={session} index={index} />
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
