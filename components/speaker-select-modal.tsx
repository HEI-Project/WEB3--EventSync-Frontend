'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Check, Users } from 'lucide-react';

interface Speaker {
  id: string;
  fullName: string;
}

interface SpeakerSelectModalProps {
  open: boolean;
  speakers: Speaker[];
  selectedIds: string[];
  onClose: () => void;
  onConfirm: (ids: string[]) => void;
}

export function SpeakerSelectModal({
  open,
  speakers,
  selectedIds,
  onClose,
  onConfirm,
}: SpeakerSelectModalProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>(selectedIds);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelected(selectedIds);
  }, [selectedIds, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const filtered = speakers.filter((s) =>
    s.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    onConfirm(selected);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-lg rounded-2xl border border-slate-700/50 bg-slate-900 p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-violet-400" />
                Sélectionner des intervenants
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un intervenant..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-colors"
              />
            </div>

            {/* Count */}
            <p className="text-xs text-slate-500 mb-3">
              {selected.length} sélectionné{selected.length > 1 ? 's' : ''}
              {' · '}
              {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
            </p>

            {/* List */}
            <div className="max-h-64 overflow-y-auto space-y-1 rounded-lg border border-slate-700/50 bg-slate-800/30 p-1.5">
              {filtered.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  Aucun intervenant trouvé
                </p>
              ) : (
                filtered.map((speaker) => {
                  const isSelected = selected.includes(speaker.id);
                  return (
                    <button
                      key={speaker.id}
                      type="button"
                      onClick={() => toggle(speaker.id)}
                      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all ${
                        isSelected
                          ? 'bg-violet-500/15 text-white'
                          : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                      }`}
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                          isSelected
                            ? 'border-violet-500 bg-violet-500'
                            : 'border-slate-600 bg-slate-800'
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/20 text-xs font-bold text-violet-400">
                        {speaker.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span className="flex-1">{speaker.fullName}</span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="mt-5 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="btn-primary px-6 py-2 text-sm"
              >
                Confirmer ({selected.length})
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
