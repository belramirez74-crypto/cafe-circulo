import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import {
  LayoutDashboard, User, LogOut, Store, ChevronLeft, PanelRightOpen, CircleUser
} from 'lucide-react';

const sidebarLinks = [
  { to: '/staff', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/staff/profile', icon: User, label: 'Mi Perfil' },
];

export default function StaffLayout({ children }) {
  const { user, logout } = useUserAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cafe-bg flex">
      <aside
        className={`bg-cafe-surface border-r border-cafe-border flex flex-col transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        <div className="h-16 flex items-center border-b border-cafe-border px-3">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <Store className="w-6 h-6 text-cafe-burgundy-light shrink-0" />
            {!collapsed && (
              <span className="font-display text-lg tracking-wider text-cafe-text truncate">
                CAFÉ CÍRCULO
              </span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-cafe-muted hover:text-cafe-cream transition-colors shrink-0"
          >
            {collapsed ? <PanelRightOpen className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                  isActive
                    ? 'bg-cafe-accent/20 text-cafe-cream'
                    : 'text-cafe-muted hover:text-cafe-text hover:bg-cafe-card/30'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="text-sm font-medium truncate">{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-cafe-border p-3">
          <div className="flex items-center gap-3 min-w-0">
            <CircleUser className="w-8 h-8 text-cafe-muted shrink-0" />
            {!collapsed && user && (
              <div className="min-w-0 flex-1">
                <p className="text-sm text-cafe-text truncate">{user.name}</p>
                <p className="text-xs text-cafe-muted truncate">{user.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 flex items-center gap-2 w-full px-3 py-2 text-sm text-cafe-muted hover:text-cafe-burgundy-light hover:bg-cafe-card/30 rounded transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
