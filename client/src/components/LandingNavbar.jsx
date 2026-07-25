import { Link, useLocation } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Menu, MapPin, Info, LogIn, User, LogOut, Star, LayoutDashboard, Home, Sun, Moon } from 'lucide-react';
import LoginModal from './LoginModal';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

function NavLink({ to, icon: Icon, label, active, blocked }) {
  const isActive = active || false;
  const isBlocked = blocked || false;
  const content = (
    <div className="flex items-center gap-1.5 text-sm">
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
    </div>
  );
  return (
    <Link
      to={to}
      onClick={e => isBlocked && e.preventDefault()}
      className={`relative px-3 py-1.5 rounded text-sm font-medium transition-all duration-200
        ${isBlocked
          ? 'text-white/30 cursor-not-allowed'
          : isActive
            ? 'text-white bg-white/15 shadow-[0_0_12px_rgba(255,255,255,0.15)]'
            : 'text-white/60 hover:text-white hover:bg-white/5 hover:shadow-[0_0_8px_rgba(255,255,255,0.08)]'
        }
      `}
    >
      {content}
    </Link>
  );
}

function CtaButton({ onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-medium
        text-white bg-cafe-accent border border-cafe-accent
        hover:bg-cafe-burgundy-light hover:border-cafe-burgundy-light
        shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40
        transition-all duration-200"
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
    </button>
  );
}

export default function LandingNavbar() {
  const { user, logout: userLogout } = useUserAuth();
  const { admin, logout: adminLogout } = useAuth();
  const { light, toggle: toggleTheme } = useTheme();
  const { lang, toggle: toggleLang, t } = useLanguage();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);

  const handleLogout = () => {
    if (admin) adminLogout();
    if (user) userLogout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cafe-burgundy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.jpg" alt="Café Círculo" className="h-20 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/reserva" icon={Star} label={t('nav_reserva')} active={location.pathname === '/reserva'} />
            <NavLink to="/menu" icon={Menu} label={t('nav_menu')} active={location.pathname === '/menu'} />
            <NavLink to="/encontranos" icon={MapPin} label={t('nav_location')} active={location.pathname === '/encontranos'} />
            <NavLink to="/sobre-nosotros" icon={Info} label={t('nav_about')} active={location.pathname === '/sobre-nosotros'} />

            <div className="w-px h-5 bg-cafe-cream/10 mx-2" />

            <button
              onClick={toggleTheme}
              className="p-2 text-cafe-cream/70 hover:text-white hover:bg-white/5 rounded transition-colors"
              title={light ? 'Modo oscuro' : 'Modo claro'}
            >
              {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleLang}
              className="px-2 py-1 text-xs font-display tracking-wider rounded transition-colors border"
            >
              <span className={lang === 'es' ? 'text-white font-bold bg-white/20 px-1 rounded' : 'text-cafe-cream/50'}>ES</span>
              <span className="text-cafe-cream/30 mx-0.5">|</span>
              <span className={lang === 'en' ? 'text-white font-bold bg-white/20 px-1 rounded' : 'text-cafe-cream/50'}>EN</span>
            </button>

            {admin && (
              <>
                <NavLink
                  to="/admin"
                  icon={LayoutDashboard}
                  label={t('nav_admin')}
                  active={location.pathname.startsWith('/admin')}
                />
                <span className="text-xs font-display tracking-wider uppercase text-cafe-accent font-bold">{admin.name}</span>
              </>
            )}

            {user && user.role === 'staff' && (
              <>
                <NavLink
                  to="/staff"
                  icon={User}
                  label="Staff"
                  active={location.pathname.startsWith('/staff')}
                />
                <span className="text-xs font-display tracking-wider uppercase text-cafe-accent font-bold">{user.name}</span>
              </>
            )}

            {user && user.role === 'client' && (
              <>
                <NavLink to="/" icon={Home} label={t('nav_home')} active={location.pathname === '/'} />
                <Link to="/client/profile" className="flex items-center gap-2 group cursor-pointer">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white/15 flex items-center justify-center border-2 border-[#c4a882]">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-[#c4a882]" />
                    )}
                  </div>
                  <span className="text-xs font-display tracking-wider uppercase text-[#c4a882] font-bold group-hover:text-white transition-colors">{user.name || 'Cliente'}</span>
                </Link>
              </>
            )}

            {!user && !admin && (
              <CtaButton onClick={() => setShowLogin(true)} icon={LogIn} label={t('nav_login')} />
            )}

            {(admin || user) && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium
                  text-cafe-cream/60 border border-cafe-cream/10
                  hover:text-cafe-cream hover:border-cafe-cream/20
                  transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav_logout')}</span>
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 text-cafe-cream/70 hover:text-white"
              title={light ? 'Modo oscuro' : 'Modo claro'}
            >
              {light ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleLang}
              className="px-2 py-1 text-xs font-display tracking-wider rounded border"
            >
              <span className={lang === 'es' ? 'text-white font-bold bg-white/20 px-1 rounded' : 'text-cafe-cream/50'}>ES</span>
              <span className="text-cafe-cream/30 mx-0.5">|</span>
              <span className={lang === 'en' ? 'text-white font-bold bg-white/20 px-1 rounded' : 'text-cafe-cream/50'}>EN</span>
            </button>
            {user || admin ? (
              <>
                {user && user.role === 'client' ? (
                  <Link to="/client/profile" className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-white/15 flex items-center justify-center border-2 border-[#c4a882]">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-[#c4a882]" />
                      )}
                    </div>
                    <span className="text-xs text-[#c4a882] font-display font-bold">{user.name || 'Cliente'}</span>
                  </Link>
                ) : (
                  <span className="text-xs text-white">{admin?.name || user?.name}</span>
                )}
                <button onClick={handleLogout} className="text-cafe-cream/80 hover:text-white">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button onClick={() => setShowLogin(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-white bg-cafe-accent shadow-[0_0_10px_rgba(82,18,14,0.4)]">
                <LogIn className="w-4 h-4" />
              </button>
            )}
            <Link to="/menu" className="text-cafe-cream/80 hover:text-white">
              <Menu className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </nav>
  );
}
