'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { eventsApi } from '@/lib/api/events';
import { Event } from '@/lib/types';
import { SkeletonLoader } from '@/components/skeleton-loader';
import {
  CalendarDays,
  MapPin,
  ArrowRight,
  Sparkles,
  Users,
  Clock,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsApi
      .list()
      .then((data) => setEvents(data))
      .catch((err) => console.error('[v0] Error loading events:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute left-1/4 top-1/4 h-[300px] w-[400px] rounded-full bg-violet-500/8 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-sm text-cyan-400"
            >
              <Sparkles className="h-4 w-4" />
              Plateforme événementielle nouvelle génération
            </motion.div>

            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl">
              Vivez vos événements{' '}
              <span className="text-gradient">en temps réel</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 sm:text-xl">
              Découvrez des événements immersifs, interagissez avec les
              intervenants et posez vos questions en direct.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="#events">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center gap-2"
                >
                  Explorer les événements
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
              <Link href="/speakers">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-outline"
                >
                  Voir les intervenants
                </motion.button>
              </Link>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
            >
              {[
                { icon: CalendarDays, value: '50+', label: 'Événements' },
                { icon: Users, value: '200+', label: 'Intervenants' },
                { icon: Clock, value: '1000+', label: 'Sessions' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <stat.icon className="mx-auto h-6 w-6 text-cyan-400 mb-2" />
                  <div className="font-heading text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="relative py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
              Événements <span className="text-gradient">à venir</span>
            </h2>
            <p className="mt-3 text-slate-400">
              Explorez notre catalogue d'événements et trouvez votre prochaine
              expérience.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <SkeletonLoader count={3} type="card" />
            </div>
          ) : events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card-glow rounded-2xl p-12 text-center"
            >
              <Zap className="mx-auto h-12 w-12 text-cyan-400 mb-4" />
              <p className="text-lg text-slate-400">
                Aucun événement disponible pour le moment
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link href={`/events/${event.id}`}>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.01 }}
                      className="card-glow group h-full rounded-2xl p-6 transition-all duration-300"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20">
                          <CalendarDays className="h-5 w-5 text-cyan-400" />
                        </div>
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Événement
                        </span>
                      </div>

                      <h3 className="font-heading text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                        {event.title}
                      </h3>

                      <p className="mb-6 text-sm text-slate-400 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="space-y-2 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-600" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-600" />
                          <span>
                            {new Date(event.startDate).toLocaleDateString(
                              'fr-FR',
                              { day: 'numeric', month: 'long', year: 'numeric' }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                          <Users className="h-4 w-4 text-slate-600" />
                          <span className="text-cyan-400 font-medium">
                            {event.sessions?.length || 0} sessions
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-sm text-cyan-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Voir le détail
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/80 to-violet-900/30 p-8 sm:p-12 lg:p-16"
          >
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-[80px]" />

            <div className="relative">
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                Prêt à découvrir vos{' '}
                <span className="text-gradient">prochains événements</span> ?
              </h2>
              <p className="mt-4 max-w-xl text-slate-400">
                Rejoignez notre communauté et ne manquez plus aucun événement.
                Interagissez en temps réel avec les intervenants.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/speakers">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Intervenants
                  </motion.button>
                </Link>
                <Link href="/rooms">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-outline"
                  >
                    Salles
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400 to-violet-500">
                <Zap className="h-4 w-4 text-black" />
              </div>
              <span className="font-heading text-sm font-bold text-white">
                Event<span className="text-cyan-400">Sync</span>
              </span>
            </div>
            <p className="text-xs text-slate-600">
              &copy; {new Date().getFullYear()} EventSync. Tous droits
              réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
