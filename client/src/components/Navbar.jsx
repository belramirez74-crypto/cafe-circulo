import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserAuth } from '../context/UserAuthContext';
import { Menu, LayoutDashboard, LogOut, User, Home, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function NavLink({ to, icon: Icon, label, active, blocked }) {
  const isActive = active || false;
  const isBlocked = blocked || false;
  return (
    <Link
      to={to}
      onClick={e => isBlocked && e.preventDefault()}
      className={`relative px-3 py-1.5 rounded text-sm font-medium transition-all duration-200
        ${isBlocked
          ? 'text-cafe-muted/30 cursor-not-allowed'
          : isActive
            ? 'text-cafe-cream bg-white/10 shadow-[0_0_12px_rgba(245,240,232,0.12)]'
            : 'text-cafe-muted hover:text-cafe-text hover:bg-white/5 hover:shadow-[0_0_8px_rgba(245,240,232,0.06)]'
        }
      `}
    >
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="w-4 h-4" />}
        <span>{label}</span>
      </div>
    </Link>
  );
}

export default function Navbar() {
  const { admin, logout: adminLogout } = useAuth();
  const { user, logout: userLogout } = useUserAuth();
  const { light, toggle: toggleTheme } = useTheme();
  const location = useLocation();

  const handleLogout = () => {
    if (admin) adminLogout();
    if (user) userLogout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cafe-bg/90 backdrop-blur-md border-b border-cafe-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.jpg" alt="Café Círculo" className="h-10 w-auto" />
            <span className="font-display text-xl tracking-wider text-cafe-text group-hover:text-cafe-cream transition-colors">
              CAFÉ CÍRCULO
            </span>
          </Link>

          <div className="flex items-center gap-2">
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
              <>
                <NavLink
                  to="/"
                  icon={Home}
                  label="Inicio"
                  active={location.pathname === '/'}
                />
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

            {(admin || user) && (
              <>
                <button
                  onClick={toggleTheme}
                  className="p-2 text-cafe-muted hover:text-cafe-text hover:bg-white/5 rounded transition-colors"
                  title={light ? 'Modo oscuro' : 'Modo claro'}
                >
                  {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium
                    text-cafe-muted/60 border border-cafe-border
                    hover:text-cafe-muted hover:border-cafe-muted/30
                    transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
