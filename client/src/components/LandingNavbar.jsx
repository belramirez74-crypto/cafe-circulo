import { Link, useLocation } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Menu, LogIn, User, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';
import LoginModal from './LoginModal';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function LandingNavbar() {
  const { user, logout: userLogout } = useUserAuth();
  const { admin, logout: adminLogout } = useAuth();
  const { light, toggle: toggleTheme } = useTheme();
  const { lang, toggle: toggleLang } = useLanguage();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);

  const handleLogout = () => {
    if (admin) adminLogout();
    if (user) userLogout();
  };

  const isMgmt = admin || user;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cafe-burgundy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.jpg" alt="Café Círculo" className="h-20 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/menu"
              className={`relative px-3 py-1.5 rounded text-sm font-medium transition-all duration-200
                ${location.pathname === '/menu' ? 'text-white bg-white/15 shadow-[0_0_12px_rgba(255,255,255,0.15)]' : 'text-white/60 hover:text-white hover:bg-white/5'}
              `}
            >
              <div className="flex items-center gap-1.5">
                <Menu className="w-4 h-4" />
                <span>Menú</span>
              </div>
            </Link>

            <div className="w-px h-5 bg-cafe-cream/10 mx-2" />

            {admin && (
              <>
                <Link to="/admin"
                  className={`relative px-3 py-1.5 rounded text-sm font-medium transition-all duration-200
                    ${location.pathname.startsWith('/admin') ? 'text-white bg-white/15 shadow-[0_0_12px_rgba(255,255,255,0.15)]' : 'text-white/60 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <div className="flex items-center gap-1.5">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </div>
                </Link>
                <span className="text-xs font-display tracking-wider uppercase text-cafe-accent font-bold">{admin.name}</span>
              </>
            )}

            {user && user.role === 'staff' && (
              <>
                <Link to="/staff"
                  className={`relative px-3 py-1.5 rounded text-sm font-medium transition-all duration-200
                    ${location.pathname.startsWith('/staff') ? 'text-white bg-white/15 shadow-[0_0_12px_rgba(255,255,255,0.15)]' : 'text-white/60 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>Staff</span>
                  </div>
                </Link>
                <span className="text-xs font-display tracking-wider uppercase text-cafe-accent font-bold">{user.name}</span>
              </>
            )}

            {user && user.role === 'client' && (
              <Link to="/client/profile" className="flex items-center gap-2 group cursor-pointer">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white/15 flex items-center justify-center border-2 border-[#c4a882]">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-[#c4a882]" />
                  )}
                </div>
                <span className="text-xs font-display tracking-wider uppercase text-[#c4a882] font-bold group-hover:text-white transition-colors">{user.name}</span>
              </Link>
            )}

            <button onClick={toggleTheme}
              className="p-2 text-cafe-cream/70 hover:text-white hover:bg-white/5 rounded transition-colors"
              title={light ? 'Modo oscuro' : 'Modo claro'}
            >
              {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <button onClick={toggleLang}
              className="px-2 py-1 text-xs font-display tracking-wider rounded transition-colors border border-cafe-cream/10"
            >
              <span className={lang === 'es' ? 'text-white font-bold bg-white/20 px-1 rounded' : 'text-cafe-cream/50'}>ES</span>
              <span className="text-cafe-cream/30 mx-0.5">|</span>
              <span className={lang === 'en' ? 'text-white font-bold bg-white/20 px-1 rounded' : 'text-cafe-cream/50'}>EN</span>
            </button>

            {!isMgmt && (
              <button onClick={() => setShowLogin(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-medium text-white bg-cafe-accent border border-cafe-accent hover:bg-cafe-burgundy-light hover:border-cafe-burgundy-light shadow-lg shadow-black/30 hover:shadow-xl transition-all duration-200"
              >
                <LogIn className="w-4 h-4" />
                <span>Ingresar</span>
              </button>
            )}

            {isMgmt && (
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-cafe-cream/60 border border-cafe-cream/10 hover:text-cafe-cream hover:border-cafe-cream/20 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 text-cafe-cream/70 hover:text-white">
              {light ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button onClick={toggleLang} className="px-2 py-1 text-xs font-display tracking-wider rounded border border-cafe-cream/10">
              <span className={lang === 'es' ? 'text-white font-bold bg-white/20 px-1 rounded' : 'text-cafe-cream/50'}>ES</span>
              <span className="text-cafe-cream/30 mx-0.5">|</span>
              <span className={lang === 'en' ? 'text-white font-bold bg-white/20 px-1 rounded' : 'text-cafe-cream/50'}>EN</span>
            </button>
            {isMgmt ? (
              <>
                {(admin || user?.role === 'staff') && (
                  <Link to={admin ? '/admin' : '/staff'} className="text-cafe-cream/80 hover:text-white p-1">
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                )}
                {user?.role === 'client' && (
                  <Link to="/client/profile" className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-white/15 flex items-center justify-center border-2 border-[#c4a882]">
                      {user.avatar_url ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" /> : <User className="w-3.5 h-3.5 text-[#c4a882]" />}
                    </div>
                  </Link>
                )}
                <button onClick={handleLogout} className="text-cafe-cream/80 hover:text-white p-1">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button onClick={() => setShowLogin(true)} className="flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium text-white bg-cafe-accent shadow-[0_0_10px_rgba(82,18,14,0.4)]">
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
