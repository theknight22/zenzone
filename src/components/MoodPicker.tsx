import { VolumeX, Music, MessageCircle } from 'lucide-react';
import type { Mood } from '@/types';

interface Props {
  mood: Mood | null;
  onMood: (mood: Mood) => void;
}

const moods: { key: Mood; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'tisina', label: 'Tišina', icon: <VolumeX className="w-5 h-5" />, desc: 'Potpuna tišina' },
  { key: 'muzika', label: 'Muzika', icon: <Music className="w-5 h-5" />, desc: 'Ambijentalna muzika' },
  { key: 'razgovor', label: 'Razgovor', icon: <MessageCircle className="w-5 h-5" />, desc: 'Opuštena komunikacija' },
];

export function MoodPicker({ mood, onMood }: Props) {
  return (
    <div>
      <h3 className="font-serif text-xl text-sage-800 mb-1">Ambijent</h3>
      <p className="text-warm-400 text-sm mb-5">Kako želiš da tvoj tretman izgleda?</p>

      <div className="grid grid-cols-3 gap-3">
        {moods.map((m) => {
          const isActive = mood === m.key;
          return (
            <button
              key={m.key}
              onClick={() => onMood(m.key)}
              className={`rounded-xl border-2 p-4 text-center transition-all ${
                isActive
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-cream-200 bg-white hover:border-sage-300'
              }`}
            >
              <div className={`mx-auto mb-2 ${isActive ? 'text-sage-600' : 'text-warm-400'}`}>
                {m.icon}
              </div>
              <p className={`text-sm font-medium ${isActive ? 'text-sage-800' : 'text-warm-700'}`}>
                {m.label}
              </p>
              <p className="text-xs text-warm-400 mt-0.5">{m.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
