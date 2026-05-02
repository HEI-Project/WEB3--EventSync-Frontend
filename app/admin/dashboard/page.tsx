'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Mic, Users, Building2, LogOut, ArrowRight } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('adminUser');

    if (!token || !userStr) {
      router.push('/admin/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
    } catch (err) {
      console.error('[v0] Error parsing user:', err);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-background bg-grid flex items-center justify-center">
      <p className="text-slate-400">Chargement...</p>
    </div>
  );
  if (!user) return null;

  const adminSections = [
    {
      title: 'Événements',
      description: 'Gérer les événements',
      href: '/admin/events',
      icon: Calendar,
      color: 'from-cyan-500/20 to-cyan-600/10',
      textColor: 'text-cyan-400',
    },
    {
      title: 'Sessions',
      description: 'Gérer les sessions',
      href: '/admin/sessions',
      icon: Mic,
      color: 'from-violet-500/20 to-violet-600/10',
      textColor: 'text-violet-400',
    },
    {
      title: 'Intervenants',
      description: 'Gérer les intervenants',
      href: '/admin/speakers',
      icon: Users,
      color: 'from-emerald-500/20 to-emerald-600/10',
      textColor: 'text-emerald-400',
    },
    {
      title: 'Salles',
      description: 'Gérer les salles',
      href: '/admin/rooms',
      icon: Building2,
      color: 'from-amber-500/20 to-amber-600/10',
      textColor: 'text-amber-400',
    },
  ];

  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-[300px] w-[400px] rounded-full bg-violet-500/8 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
        >
          <div>
            <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
              Tableau de <span className="text-gradient">bord</span>
            </h1>
            <p className="mt-2 text-slate-400">
              Bienvenue, <span className="text-slate-300 font-medium">{user.email}</span>
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-400 hover:border-red-500/30 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </motion.button>
        </motion.div>

        {/* Sections grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {adminSections.map((section, index) => (
            <motion.div
              key={section.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              <Link href={section.href}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="card-glow group h-full rounded-2xl p-6 transition-all duration-300 cursor-pointer"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${section.color} border border-slate-700/50 mb-4`}>
                    <section.icon className={`h-6 w-6 ${section.textColor}`} />
                  </div>
                  <h2 className="font-heading text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {section.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {section.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 group-hover:text-cyan-400 transition-colors opacity-0 group-hover:opacity-100">
                    Accéder
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 card-glow rounded-2xl p-6 sm:p-8"
        >
          <h2 className="font-heading text-lg font-bold text-white mb-6">
            Actions rapides
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/events/new">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Calendar className="h-4 w-4" />
                Nouvel événement
              </motion.button>
            </Link>
            <Link href="/admin/sessions/new">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 hover:border-violet-500/30 hover:text-violet-400 transition-colors flex items-center gap-2"
              >
                <Mic className="h-4 w-4" />
                Nouvelle session
              </motion.button>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
