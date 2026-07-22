import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarPlus, Layout, Users, ArrowRight, User, UserCog, ShoppingBag, BarChart3, DollarSign } from 'lucide-react';

const cards = [
  {
    to: '/admin/profile',
    icon: User,
    title: 'Mi Perfil',
    desc: 'Datos de administrador y configuración de cuenta',
  },
  {
    to: '/admin/landing',
    icon: Layout,
    title: 'Landing Page',
    desc: 'Personalizá el contenido de la página principal en tiempo real',
  },
  {
    to: '/admin/menu',
    icon: ShoppingBag,
    title: 'Gestión de Menú',
    desc: 'Agregá, editá o desactivá productos del menú',
  },
  {
    to: '/admin/clients',
    icon: UserCog,
    title: 'Gestión de Clientes',
    desc: 'Administrá clientes, historial y preferencias',
  },
  {
    to: '/admin/staff',
    icon: Users,
    title: 'Gestión de Staff',
    desc: 'Administrá el personal, asigná tareas y gestioná el calendario',
  },
  {
    to: '/admin/events',
    icon: CalendarPlus,
    title: 'Eventos & Promos',
    desc: 'Creá y gestioná eventos culturales y promociones',
  },
  {
    to: '/admin/stats',
    icon: BarChart3,
    title: 'Reportes',
    desc: 'Estadísticas generales, métricas de menú, staff y clientes',
  },
  {
    to: '/admin/ventas',
    icon: DollarSign,
    title: 'Ventas',
    desc: 'Registrá ventas, conocé lo más vendido y qué promocionar',
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.to}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="h-full"
              >
                <Link
                  to={card.to}
                  className="block bg-cafe-surface border border-cafe-border border-l-4 border-l-[#5c1514] p-6 transition-all group rounded-xl h-full flex flex-col justify-between hover:border-l-[#5c1514] hover:bg-cafe-card"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Icon className="w-8 h-8 text-[#5c1514] shrink-0 mt-1 transition-colors" />
                      <div>
                        <h2 className="font-display text-xl text-[#5c1514] transition-colors">
                          {card.title}
                        </h2>
                        <p className="text-[#5c1514]/70 text-sm mt-1 line-clamp-2">{card.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#5c1514] group-hover:translate-x-1 transition-all shrink-0" />
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
