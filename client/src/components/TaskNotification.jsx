import { useEffect, useState, useRef } from 'react';
import { getStaffTasks } from '../lib/api';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TaskNotification() {
  const [tasks, setTasks] = useState([]);
  const [notification, setNotification] = useState(null);
  const prevIdsRef = useRef(new Set());

  useEffect(() => {
    const check = () => {
      getStaffTasks()
        .then(r => {
          const current = r.data || [];
          const currentIds = new Set(current.filter(t => t.status !== 'completed').map(t => t.id));
          if (prevIdsRef.current.size > 0) {
            for (const t of current) {
              if (t.status !== 'completed' && !prevIdsRef.current.has(t.id)) {
                setNotification(t);
                break;
              }
            }
          }
          prevIdsRef.current = currentIds;
          setTasks(current);
        })
        .catch(() => {});
    };
    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-[100] w-80 bg-cafe-surface border border-cafe-accent/40 shadow-lg shadow-cafe-accent/10"
        >
          <div className="flex items-start gap-3 p-4">
            <div className="w-8 h-8 rounded bg-cafe-accent/20 flex items-center justify-center shrink-0 mt-0.5">
              <Bell className="w-4 h-4 text-cafe-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-display tracking-wider text-cafe-accent mb-1">NUEVA TAREA</p>
              <p className="text-sm text-cafe-text font-display truncate">{notification.title}</p>
              {notification.description && (
                <p className="text-xs text-cafe-muted mt-0.5 truncate">{notification.description}</p>
              )}
              {notification.due_date && (
                <p className="text-xs text-cafe-muted-dark mt-1">
                  Vence: {new Date(notification.due_date).toLocaleDateString('es-AR')}
                </p>
              )}
            </div>
            <button onClick={() => setNotification(null)} className="text-cafe-muted hover:text-cafe-text transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
