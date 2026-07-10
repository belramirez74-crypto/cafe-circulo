import { useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { useAuth } from '../context/AuthContext';
import { userLogin } from '../lib/api';
import { Lock, Mail, Store, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginModal({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useUserAuth();
  const { setAdmin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await userLogin(email, password);
      const userData = res.data.user;
      localStorage.setItem('user_token', res.data.token);
      localStorage.setItem('app_user', JSON.stringify(userData));
      setUser(userData);
      if (userData.role === 'admin') {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('admin', JSON.stringify(userData));
        setAdmin(userData);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-sm bg-cafe-surface border border-cafe-border"
          >
            <div className="flex items-center justify-between p-4 border-b border-cafe-border">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-cafe-burgundy-light" />
                <h2 className="font-display text-lg text-cafe-text">INICIAR SESIÓN</h2>
              </div>
              <button onClick={onClose} className="text-cafe-muted hover:text-cafe-text transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-cafe-burgundy/10 border border-cafe-burgundy/30 text-cafe-burgundy-light text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">EMAIL</label>
                <div className="flex items-center border border-cafe-border bg-cafe-bg focus-within:border-cafe-accent transition-colors">
                  <Mail className="w-4 h-4 text-cafe-muted ml-3 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent text-cafe-text focus:outline-none"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">CONTRASEÑA</label>
                <div className="flex items-center border border-cafe-border bg-cafe-bg focus-within:border-cafe-accent transition-colors">
                  <Lock className="w-4 h-4 text-cafe-muted ml-3 shrink-0" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent text-cafe-text focus:outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cafe-accent text-white font-display tracking-wider hover:bg-cafe-burgundy-light transition-colors disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                {loading ? 'INGRESANDO...' : 'INGRESAR'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
