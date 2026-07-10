import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UtensilsCrossed, CalendarPlus, Layout, Users, ArrowRight, User, UserCog, ShoppingBag } from 'lucide-react';

const cards = [
  {
    to: '/admin/profile',
    icon: User,
    title: 'Mi Perfil',
    desc: 'Datos de administrador y configuración de cuenta',
    color: 'border-l-cafe-accent hover:border-l-cafe-cream',
  },
  {
    to: '/admin/landing',
    icon: Layout,
    title: 'Landing Page',
    desc: 'Personalizá el contenido de la página principal en tiempo real',
    color: 'border-l-cafe-burgundy-light hover:border-l-cafe-accent',
  },
  {
    to: '/admin/menu',
    icon: ShoppingBag,
    title: 'Gestión de Menú',
    desc: 'Agregá, editá o desactivá productos del menú',
    color: 'border-l-cafe-cream hover:border-l-cafe-accent',
  },
  {
    to: '/admin/clients',
    icon: UserCog,
    title: 'Gestión de Clientes',
    desc: 'Administrá clientes, historial y preferencias',
    color: 'border-l-cafe-accent hover:border-l-cafe-burgundy-light',
  },
  {
    to: '/admin/staff',
    icon: Users,
    title: 'Gestión de Staff',
    desc: 'Administrá el personal, asigná tareas y gestioná el calendario',
    color: 'border-l-cafe-burgundy-light hover:border-l-cafe-accent',
  },
  {
    to: '/admin/events',
    icon: CalendarPlus,
    title: 'Eventos & Promos',
    desc: 'Creá y gestioná eventos culturales y promociones',
    color: 'border-l-cafe-cream hover:border-l-cafe-accent',
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl text-cafe-text"
          >
            DASHBOARD
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-cafe-muted mt-2"
          >
            Panel de control de Café Círculo
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.to}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={card.to}
                  className={`block bg-cafe-surface border border-cafe-border border-l-4 p-6 transition-all group ${card.color}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Icon className="w-8 h-8 text-cafe-cream shrink-0 mt-1" />
                      <div>
                        <h2 className="font-display text-xl text-cafe-text group-hover:text-cafe-cream transition-colors">
                          {card.title}
                        </h2>
                        <p className="text-cafe-muted text-sm mt-1">{card.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-cafe-muted group-hover:text-cafe-cream transition-colors" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
