import { useEffect, useState } from 'react';
import { getAdminClients } from '../../lib/api';
import { Users, Mail, Calendar, Search } from 'lucide-react';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAdminClients().then(r => setClients(r.data)).catch(() => {});
  }, []);

  const filtered = search
    ? clients.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()))
    : clients;

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl text-cafe-text">GESTIÓN DE CLIENTES</h1>
            <p className="text-cafe-muted text-sm mt-1">{clients.length} clientes registrados</p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cafe-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full pl-10 pr-4 py-2.5 bg-cafe-surface border border-cafe-border text-cafe-text text-sm focus:outline-none focus:border-cafe-accent"
          />
        </div>

        <div className="bg-cafe-surface border border-cafe-border overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-cafe-border">
                <th className="p-4 font-display text-xs tracking-widest text-cafe-muted/60">NOMBRE</th>
                <th className="p-4 font-display text-xs tracking-widest text-cafe-muted/60">EMAIL</th>
                <th className="p-4 font-display text-xs tracking-widest text-cafe-muted/60">REGISTRO</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(client => (
                <tr key={client.id} className="border-b border-cafe-border/30 hover:bg-cafe-bg/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cafe-accent/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-cafe-accent" />
                      </div>
                      <span className="font-display text-sm text-cafe-text">{client.name || '—'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-cafe-muted">
                      <Mail className="w-3.5 h-3.5" />
                      {client.email}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-cafe-muted">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(client.created_at).toLocaleDateString('es-AR')}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-cafe-muted/50 text-sm">
                    {search ? 'Sin resultados' : 'No hay clientes registrados'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
