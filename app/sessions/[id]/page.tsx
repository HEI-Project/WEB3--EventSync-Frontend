'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { sessionsApi } from '@/lib/api/sessions';
import { questionsApi } from '@/lib/api/questions';
import { Session, Question } from '@/lib/types';
import { SkeletonLoader } from '@/components/skeleton-loader';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Users,
  ThumbsUp,
  Send,
  Zap,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [session, setSession] = useState<Session | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    sessionsApi
      .get(sessionId)
      .then((data) => {
        setSession(data);
        checkIfLive(data);
        loadQuestions();
      })
      .catch((err) => console.error('[v0] Error loading session:', err))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const checkIfLive = (s: Session) => {
    const now = new Date();
    setIsLive(
      new Date(s.startTime) <= now && now <= new Date(s.endTime)
    );
  };

  const loadQuestions = async () => {
    try {
      setQuestionsLoading(true);
      const data = await questionsApi.get(sessionId);
      setQuestions(data);
    } catch (err) {
      console.error('[v0] Error loading questions:', err);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      setSubmitting(true);
      await questionsApi.ask(
        sessionId,
        newQuestion,
        authorName || 'Anonyme'
      );
      setNewQuestion('');
      setAuthorName('');
      await loadQuestions();
    } catch (err) {
      console.error('[v0] Error asking question:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (questionId: string) => {
    try {
      await questionsApi.upvote(questionId);
      await loadQuestions();
    } catch (err) {
      console.error('[v0] Error upvoting question:', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background bg-grid pt-24 px-4">
      <div className="mx-auto max-w-4xl px-4">
        <SkeletonLoader count={3} />
      </div>
    </div>
  );

  if (!session) return (
    <div className="min-h-screen bg-background bg-grid pt-24 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="mb-6 inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20">
          <Zap className="h-10 w-10 text-cyan-400" />
        </div>
        <p className="text-xl text-slate-400">Session non trouvée</p>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Retour à l'accueil
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
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>

        {/* Session Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-sm text-cyan-400"
              >
                <Sparkles className="h-4 w-4" />
                Session
              </motion.div>

              <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {session.title}
              </h1>

              {isLive && (
                <motion.div
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="badge-live mt-3"
                >
                  En direct
                </motion.div>
              )}
            </div>
          </div>

          <p className="mt-4 text-lg text-slate-400">{session.description}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="card-glow rounded-xl p-4">
              <div className="mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan-400" />
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Horaire
                </p>
              </div>
              <p className="text-sm text-slate-300">
                {new Date(session.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} -{' '}
                {new Date(session.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="card-glow rounded-xl p-4">
              <div className="mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Salle
                </p>
              </div>
              <p className="text-sm text-slate-300">
                {session.room?.name || 'N/A'}
              </p>
            </div>
            <div className="card-glow rounded-xl p-4">
              <div className="mb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-400" />
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Capacité
                </p>
              </div>
              <p className="text-sm text-slate-300">
                {session.capacity} places
              </p>
            </div>
          </div>
        </motion.div>

        {/* Speakers */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20">
              <Users className="h-5 w-5 text-cyan-400" />
            </div>
            <h2 className="font-heading text-xl font-bold text-white">
              Intervenants
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {session.speakers?.map((speaker) => (
              <Link key={speaker.id} href={`/speakers/${speaker.id}`}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="card-glow rounded-xl p-4 transition-all cursor-pointer hover:border-cyan-500/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20 text-sm font-bold text-cyan-400">
                      {speaker.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-medium text-white">{speaker.fullName}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Q&A Section */}
        {isLive && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12 card-glow rounded-2xl p-6 sm:p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20">
                <MessageSquare className="h-5 w-5 text-cyan-400" />
              </div>
              <h2 className="font-heading text-xl font-bold text-white">
                Poser une question
              </h2>
            </div>

            <form onSubmit={handleAskQuestion} className="space-y-4">
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Votre question..."
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                rows={3}
                required
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Votre nom (optionnel)"
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={submitting || !newQuestion.trim()}
                  className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? 'Envoi...' : 'Envoyer'}
                </motion.button>
              </div>
            </form>
          </motion.section>
        )}

        {/* Questions list */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20">
              <MessageSquare className="h-5 w-5 text-cyan-400" />
            </div>
            <h2 className="font-heading text-xl font-bold text-white">
              Questions ({questions.length})
            </h2>
          </div>

          {questionsLoading ? (
            <SkeletonLoader count={3} type="card" />
          ) : questions.length === 0 ? (
            <div className="card-glow rounded-2xl p-8 text-center">
              <p className="text-slate-400">
                {isLive
                  ? 'Aucune question pour le moment'
                  : 'Les questions seront disponibles quand la session sera en direct'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card-glow rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-600 mb-1">
                        {question.authorName}
                      </p>
                      <p className="text-sm text-slate-300">
                        {question.content}
                      </p>
                    </div>
                    <button
                      onClick={() => handleUpvote(question.id)}
                      aria-label={`Upvoter la question de ${question.authorName}`}
                      className="flex items-center gap-1.5 rounded-lg bg-slate-800/50 px-3 py-2 text-xs font-medium text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors whitespace-nowrap"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {question.upvoteCount}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
