import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { userLogin } from '../lib/api';
import { Lock, Mail, Store, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useUserAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await userLogin(email, password);
      localStorage.setItem('user_token', res.data.token);
      localStorage.setItem('app_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || t('login_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-cafe-muted hover:text-cafe-text transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> {t('login_back')}
          </Link>
          <Store className="w-10 h-10 text-cafe-burgundy-light mx-auto mb-3" />
          <h1 className="font-display text-3xl text-cafe-text">CAFÉ CÍRCULO</h1>
          <p className="text-cafe-muted text-sm mt-1">{t('login_subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-cafe-surface border border-cafe-border p-6 space-y-4 rounded-xl">
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
            <label className="block text-xs font-display tracking-wider text-cafe-muted mb-1">{t('login_password')}</label>
            <div className="flex items-center border border-cafe-border bg-cafe-bg focus-within:border-cafe-accent transition-colors">
              <Lock className="w-4 h-4 text-cafe-muted ml-3 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-transparent text-cafe-text focus:outline-none"
                placeholder="••••••••"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="mr-3 text-cafe-muted hover:text-cafe-text transition-colors shrink-0">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cafe-accent text-white font-display tracking-wider hover:bg-cafe-burgundy-light transition-colors disabled:opacity-50 rounded-xl shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40"
          >
            <Lock className="w-4 h-4" />
            {loading ? t('login_loading') : t('login_submit')}
          </button>
        </form>

        <p className="text-center text-cafe-muted text-xs mt-6">
          {t('login_no_account')}
        </p>
      </div>
    </div>
  );
}
