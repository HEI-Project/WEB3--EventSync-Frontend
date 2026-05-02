'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SessionLite } from '@/lib/types';
import { Users, MapPin, Clock, Star } from 'lucide-react';

interface SessionCardProps {
  session: SessionLite;
  isLive?: boolean;
  onAddFavorite?: (id: string) => void;
  isFavorite?: boolean;
  index?: number;
}

export function SessionCard({
  session,
  isLive = false,
  onAddFavorite,
  isFavorite = false,
  index = 0,
}: SessionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const startTime = new Date(session.startTime);
  const endTime = new Date(session.endTime);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <Link href={`/sessions/${session.id}`}>
        <motion.div
          animate={{ y: isHovered ? -4 : 0 }}
          className="card-glow flex h-full flex-col rounded-2xl p-5 transition-all duration-300"
        >
          {/* Header with live badge */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-white line-clamp-2 group-hover:text-cyan-400 transition-colors">
                {session.title}
              </h3>
            </div>
            {isLive && (
              <motion.div
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="badge-live ml-3 whitespace-nowrap"
              >
                Live
              </motion.div>
            )}
          </div>

          {/* Time and room */}
          <div className="mb-4 flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-slate-600" />
              <span>
                {formatTime(startTime)} - {formatTime(endTime)}
              </span>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-1.5 text-sm">
            <MapPin className="h-4 w-4 text-cyan-400" />
            <span className="font-medium text-cyan-400">
              {session.room?.name || 'Salle TBD'}
            </span>
          </div>

          {/* Speakers */}
          <div className="mb-4 flex-1">
            <p className="mb-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Intervenants
            </p>
            <div className="flex flex-wrap gap-1.5">
              {session.speakers?.slice(0, 2).map((speaker) => (
                <span
                  key={speaker.id}
                  className="inline-flex items-center rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-medium text-cyan-400"
                >
                  <Users className="h-3 w-3 mr-1" />
                  {speaker.fullName}
                </span>
              ))}
              {(session.speakers?.length || 0) > 2 && (
                <span className="inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
                  +{(session.speakers?.length || 0) - 2}
                </span>
              )}
            </div>
          </div>

          {/* Favorite button */}
          {onAddFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddFavorite(session.id);
              }}
              aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className={`self-start inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
                isFavorite
                  ? 'text-amber-400 hover:text-amber-300'
                  : 'text-slate-600 hover:text-amber-400'
              }`}
            >
              <Star
                className={`h-4 w-4 ${isFavorite ? 'fill-amber-400' : ''}`}
              />
              {isFavorite ? 'Favori' : 'Ajouter favori'}
            </button>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}
