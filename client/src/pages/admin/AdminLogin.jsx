import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../lib/api';
import { Store, Lock } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('admin', JSON.stringify(res.data.admin));
      setAdmin(res.data.admin);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <Store className="w-12 h-12 text-cafe-accent mx-auto mb-4" />
          <h1 className="font-display text-3xl text-cafe-text">ACCESO ADMIN</h1>
          <p className="text-cafe-muted text-sm mt-2">Ingresá tus credenciales</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-cafe-surface border border-cafe-border p-8">
          <div className="mb-6">
            <label className="block text-sm font-display tracking-wider text-cafe-muted mb-2">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent transition-colors"
              placeholder="admin@cafecirculo.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-display tracking-wider text-cafe-muted mb-2">CONTRASEÑA</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-cafe-bg border border-cafe-border text-cafe-text focus:outline-none focus:border-cafe-accent transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-cafe-burgundy/10 border border-cafe-burgundy/30 text-cafe-burgundy-light text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cafe-accent text-white font-display tracking-wider hover:bg-cafe-burgundy-light transition-colors disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            {loading ? 'INGRESANDO...' : 'INGRESAR'}
          </button>
        </form>
      </div>
    </div>
  );
}
