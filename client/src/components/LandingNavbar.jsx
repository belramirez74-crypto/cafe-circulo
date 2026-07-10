import { Link, useLocation } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Menu, MapPin, Info, LogIn, User, LogOut, Star, LayoutDashboard } from 'lucide-react';
import LoginModal from './LoginModal';

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
          ? 'text-cafe-cream/30 cursor-not-allowed'
          : isActive
            ? 'text-white bg-white/10 shadow-[0_0_12px_rgba(245,240,232,0.15)]'
            : 'text-cafe-cream/80 hover:text-white hover:bg-white/5 hover:shadow-[0_0_8px_rgba(245,240,232,0.08)]'
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
      className="flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-medium
        text-white bg-cafe-accent border border-cafe-accent
        hover:bg-cafe-burgundy-light hover:border-cafe-burgundy-light
        shadow-[0_0_10px_rgba(82,18,14,0.4)]
        hover:shadow-[0_0_16px_rgba(82,18,14,0.6)]
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
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);

  const handleLogout = () => {
    if (admin) adminLogout();
    if (user) userLogout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cafe-burgundy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.jpg" alt="Café Círculo" className="h-10 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/reserva" icon={Star} label="Reserva" active={location.pathname === '/reserva'} />
            <NavLink to="/menu" icon={Menu} label="Menú" active={location.pathname === '/menu'} />
            <NavLink to="/encontranos" icon={MapPin} label="Encontranos" active={location.pathname === '/encontranos'} />
            <NavLink to="/sobre-nosotros" icon={Info} label="Nosotros" active={location.pathname === '/sobre-nosotros'} />

            <div className="w-px h-5 bg-cafe-cream/10 mx-2" />

            {admin && (
              <>
                <NavLink
                  to="/admin"
                  icon={LayoutDashboard}
                  label="Administrador"
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
              <span className="text-xs font-display tracking-wider uppercase text-cafe-accent font-bold">{user.name}</span>
            )}

            {!user && !admin && (
              <CtaButton onClick={() => setShowLogin(true)} icon={LogIn} label="Ingresar" />
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
                <span className="hidden sm:inline">Salir</span>
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center gap-3">
            {user || admin ? (
              <>
                <span className="text-xs text-white">{admin?.name || user?.name}</span>
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
