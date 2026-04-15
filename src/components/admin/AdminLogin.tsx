import { useState } from 'react';
import { Flower2 } from 'lucide-react';
import { useAction } from 'convex/react';
import { api } from '@/lib/api';

interface Props {
  onLogin: (session: { sessionToken: string; expiresAt: number }) => void;
}

export function AdminLogin({ onLogin }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const createAdminSession = useAction(api.actions.auth.createAdminSession);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await createAdminSession({ password });
      if (result.success) {
        onLogin({
          sessionToken: result.sessionToken,
          expiresAt: result.expiresAt,
        });
      } else {
        setError('Pogrešna lozinka.');
      }
    } catch {
      setError('Greška pri provjeri lozinke.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-cream-200 p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-sage-700 font-serif text-xl font-bold mb-2">
            <Flower2 className="w-5 h-5" />
            ZenZone
          </div>
          <p className="text-warm-500 text-sm">Prijava u admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-warm-700 mb-1">
              Lozinka
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-cream-200 rounded-xl text-warm-800 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
              placeholder="Unesite lozinku"
              required
            />
          </div>

          {error && (
            <p className="text-terra-600 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-sage-600 hover:bg-sage-700 disabled:bg-sage-300 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            {loading ? 'Provjera...' : 'Prijavi se'}
          </button>
        </form>
      </div>
    </div>
  );
}
