'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/page-transition';

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

  if (loading) return <div>Chargement...</div>;
  if (!user) return null;

  const adminSections = [
    {
      title: 'Événements',
      description: 'Gérer les événements',
      href: '/admin/events',
      icon: '📅',
    },
    {
      title: 'Sessions',
      description: 'Gérer les sessions',
      href: '/admin/sessions',
      icon: '🎤',
    },
    {
      title: 'Intervenants',
      description: 'Gérer les intervenants',
      href: '/admin/speakers',
      icon: '👤',
    },
    {
      title: 'Salles',
      description: 'Gérer les salles',
      href: '/admin/rooms',
      icon: '🏛️',
    },
  ];

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
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Tableau de Bord Admin
                </h1>
                <p className="mt-2 text-gray-600">
                  Bienvenue, {user.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2 text-white font-medium hover:bg-red-700 transition-colors"
              >
                Déconnexion
              </button>
            </motion.div>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="text-4xl mb-4">{section.icon}</div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {section.title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                      {section.description}
                    </p>
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
            className="mt-12 rounded-lg border border-gray-200 bg-blue-50 p-6"
          >
            <h2 className="mb-4 text-lg font-bold text-gray-900">Actions rapides</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/admin/events/new" className="inline-block">
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors">
                  + Nouvel événement
                </button>
              </Link>
              <Link href="/admin/sessions/new" className="inline-block">
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors">
                  + Nouvelle session
                </button>
              </Link>
            </div>
          </motion.section>
        </main>
      </div>
    </PageTransition>
  );
}
