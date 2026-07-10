import { useAuth } from '../../context/AuthContext';
import { Shield, Mail, User } from 'lucide-react';

export default function AdminProfile() {
  const { admin } = useAuth();

  if (!admin) return null;

  return (
    <div>
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="font-display text-4xl text-cafe-text mb-8">MI PERFIL</h1>

        <div className="bg-cafe-surface border border-cafe-border p-8 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-cafe-border/40">
            <div className="w-16 h-16 rounded-full bg-cafe-accent/20 flex items-center justify-center">
              <User className="w-8 h-8 text-cafe-accent" />
            </div>
            <div>
              <h2 className="font-display text-xl text-cafe-text">{admin.name || 'Administrador'}</h2>
              <span className="inline-flex items-center gap-1 text-xs text-cafe-accent font-display mt-1">
                <Shield className="w-3 h-3" /> ADMINISTRADOR
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-display tracking-wider text-cafe-muted/60 mb-1">EMAIL</label>
              <div className="flex items-center gap-2 text-cafe-text">
                <Mail className="w-4 h-4 text-cafe-muted" />
                <span>{admin.email}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-display tracking-wider text-cafe-muted/60 mb-1">ROL</label>
              <span className="text-sm text-cafe-muted font-display uppercase tracking-wider">Administrador</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
