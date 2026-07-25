import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, User, Layout, ShoppingBag, UserCog, Users,
  CalendarPlus, LogOut, Store, ChevronLeft, PanelRightClose, PanelRightOpen,
  CircleUser, BarChart3, DollarSign
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarLinks = [
    { to: '/admin/profile', icon: User, label: 'MI PERFIL' },
    { to: '/admin', icon: LayoutDashboard, label: 'DASHBOARD' },
    { to: '/admin/stats', icon: BarChart3, label: 'REPORTES' },
    { to: '/admin/ventas', icon: DollarSign, label: 'VENTAS' },
    { to: '/admin/landing', icon: Layout, label: 'LANDING PAGE' },
    { to: '/admin/menu', icon: ShoppingBag, label: 'GESTIÓN DE MENÚ' },
    { to: '/admin/clients', icon: UserCog, label: 'GESTIÓN DE CLIENTES' },
    { to: '/admin/staff', icon: Users, label: 'GESTIÓN DE STAFF' },
    { to: '/admin/events', icon: CalendarPlus, label: 'EVENTOS Y PROMOS' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-cafe-bg flex panel-light">
      {/* Sidebar */}
      <aside
        className={`bg-cafe-surface border-r border-cafe-border flex flex-col transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Logo */}
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

        {/* Navigation */}
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
                    ? 'bg-[#5c1514]/15 text-[#5c1514] font-semibold'
                    : 'text-[#5c1514] hover:bg-[#5c1514]/10'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="text-sm font-medium truncate">{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Admin info & logout */}
        <div className="border-t border-cafe-border p-3">
          <div className="flex items-center gap-3 min-w-0">
            {admin?.avatar_url ? (
              <img src={admin.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full object-cover shrink-0" />
            ) : (
              <CircleUser className="w-8 h-8 text-cafe-muted shrink-0" />
            )}
            {!collapsed && admin && (
              <div className="min-w-0 flex-1">
                <p className="text-sm text-cafe-text truncate">{admin.name}</p>
                <p className="text-xs text-cafe-muted truncate">{admin.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 flex items-center gap-2 w-full px-3 py-2 text-sm text-cafe-muted hover:text-cafe-burgundy-light hover:bg-cafe-card/30 rounded transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>SALIR</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
