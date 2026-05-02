'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { adminSpeakersApi } from '@/lib/api/admin-speakers';
import { speakersApi } from '@/lib/api/speakers';
import { ArrowLeft, Users } from 'lucide-react';

export default function EditSpeakerPage() {
  const router = useRouter();
  const params = useParams();
  const speakerId = params.id as string;
  const [formData, setFormData] = useState({
    fullName: '',
    photoUrl: '',
    bio: '',
    externalLinks: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    speakersApi
      .get(speakerId)
      .then((speaker) => {
        setFormData({
          fullName: speaker.fullName,
          photoUrl: speaker.photoUrl || '',
          bio: speaker.bio,
          externalLinks: speaker.externalLinks?.join(', ') || '',
        });
      })
      .catch((err) => {
        console.error('[v0] Error loading speaker:', err);
        setError("Impossible de charger l'intervenant");
      })
      .finally(() => setLoading(false));
  }, [speakerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No token');

      await adminSpeakersApi.update(
        speakerId,
        {
          fullName: formData.fullName,
          photoUrl: formData.photoUrl,
          bio: formData.bio,
          externalLinks: formData.externalLinks
            ? formData.externalLinks.split(',').map((l) => l.trim()).filter(Boolean)
            : [],
        },
        token
      );
      router.push('/admin/speakers');
    } catch (err) {
      setError('Erreur lors de la modification');
      console.error('[v0] Error updating speaker:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background bg-grid flex items-center justify-center">
      <p className="text-slate-400">Chargement...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Link href="/admin/speakers" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Intervenants
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            Modifier <span className="text-gradient">l'intervenant</span>
          </h1>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="card-glow rounded-2xl p-6 sm:p-8"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-1.5">
                Nom complet *
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="photoUrl" className="block text-sm font-medium text-slate-300 mb-1.5">
                URL de la photo
              </label>
              <input
                id="photoUrl"
                type="url"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-1.5">
                Biographie
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="externalLinks" className="block text-sm font-medium text-slate-300 mb-1.5">
                Liens externes
              </label>
              <input
                id="externalLinks"
                type="text"
                name="externalLinks"
                value={formData.externalLinks}
                onChange={handleChange}
                placeholder="https://twitter.com/..., https://linkedin.com/in/..."
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-colors"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting || !formData.fullName}
            className="btn-primary mt-8 w-full py-2.5 text-sm flex items-center justify-center gap-2"
          >
            <Users className="h-4 w-4" />
            {submitting ? 'Modification...' : 'Modifier'}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}
