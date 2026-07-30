import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useUserAuth } from './context/UserAuthContext';
import Navbar from './components/Navbar';
import LandingNavbar from './components/LandingNavbar';
import AdminLayout from './components/AdminLayout';
import StaffLayout from './components/StaffLayout';
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import Login from './pages/Login';
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffProfile from './pages/staff/StaffProfile';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import AdminMenu from './pages/admin/AdminMenu';
import AdminEvents from './pages/admin/AdminEvents';
import AdminLanding from './pages/admin/AdminLanding';
import AdminStaff from './pages/admin/AdminStaff';
import AdminClients from './pages/admin/AdminClients';
import AdminStats from './pages/admin/AdminStats';
import AdminVentas from './pages/admin/AdminVentas';
import ClientProfile from './pages/client/ClientProfile';
import ProtectedRoute from './components/ProtectedRoute';

function StaffRoute({ children }) {
  const { user, loading } = useUserAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-cafe-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Login />;
  return children;
}

function AdminRoute({ children }) {
  return (
    <ProtectedRoute>
      <AdminLayout>
        {children}
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  const location = useLocation();
  const landingPaths = ['/', '/menu'];
  const isLanding = landingPaths.includes(location.pathname);
  const isAdmin = location.pathname.startsWith('/admin');
  const isStaff = location.pathname.startsWith('/staff');

  return (
    <>
      {isAdmin || isStaff ? null : isLanding ? <LandingNavbar /> : <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/reserva" element={<Navigate to="/" replace />} />
          <Route path="/encontranos" element={<Navigate to="/" replace />} />
          <Route path="/sobre-nosotros" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/staff" element={<StaffRoute><StaffLayout><StaffDashboard /></StaffLayout></StaffRoute>} />
          <Route path="/staff/profile" element={<StaffRoute><StaffLayout><StaffProfile /></StaffLayout></StaffRoute>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />
          <Route path="/admin/menu" element={<AdminRoute><AdminMenu /></AdminRoute>} />
          <Route path="/admin/events" element={<AdminRoute><AdminEvents /></AdminRoute>} />
          <Route path="/admin/landing" element={<AdminRoute><AdminLanding /></AdminRoute>} />
          <Route path="/admin/staff" element={<AdminRoute><AdminStaff /></AdminRoute>} />
          <Route path="/admin/clients" element={<AdminRoute><AdminClients /></AdminRoute>} />
          <Route path="/admin/stats" element={<AdminRoute><AdminStats /></AdminRoute>} />
          <Route path="/admin/ventas" element={<AdminRoute><AdminVentas /></AdminRoute>} />
          <Route path="/client/profile" element={<StaffRoute><ClientProfile /></StaffRoute>} />
        </Routes>
      </main>
    </>
  );
}
