import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Bell, User, CreditCard, AlertCircle, BarChart, Filter, Upload, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptions } from '@/contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import SubscriptionCard from '@/components/SubscriptionCard';
import { toast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { subscriptions, getMonthlyNetTotal, getUpcomingPayments } = useSubscriptions();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [filter, setFilter] = useState('all');

  const monthlyTotal = getMonthlyNetTotal();
  const upcomingPayments = getUpcomingPayments(7);

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const baseCategories = ['all', 'shared', ...new Set(activeSubscriptions.map(s => s.category))];
  const categories = [...new Set(baseCategories)];

  const filteredSubscriptions = activeSubscriptions.filter(sub => {
    if (filter === 'all') return true;
    if (filter === 'shared') return sub.isShared;
    return sub.category === filter;
  });

  const handleNotificationClick = () => {
    if (upcomingPayments.length === 0) {
      toast({
        title: "Sin notificaciones",
        description: "No tienes pagos próximos en los próximos 7 días",
      });
    } else {
      setShowNotifications(!showNotifications);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass-effect p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-white">MS</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">MisSuscripciones</h1>
              <p className="text-sm text-muted-foreground">Hola, {user?.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
             <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/stats')}
              className="text-muted-foreground hover:text-foreground"
            >
              <BarChart className="w-5 h-5" />
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNotificationClick}
                className="relative text-muted-foreground hover:text-foreground"
              >
                <Bell className="w-5 h-5" />
                {upcomingPayments.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {upcomingPayments.length}
                  </span>
                )}
              </Button>
              
              {showNotifications && upcomingPayments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute right-0 top-12 w-80 bg-card rounded-xl p-4 shadow-xl border border-border z-50"
                >
                  <h3 className="font-semibold text-foreground mb-3">Próximos pagos</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                    {upcomingPayments.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-foreground">{sub.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(sub.nextPayment).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-emerald-400">
                          ${sub.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/profile')}
              className="text-muted-foreground hover:text-foreground"
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card-gradient rounded-2xl p-6 flex items-center justify-between">
            <div>
                <p className="text-muted-foreground text-sm">Tu gasto mensual real</p>
                <p className="text-3xl font-bold text-foreground">
                  ${monthlyTotal.toFixed(2)}
                </p>
              </div>
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-emerald-400" />
              </div>
          </div>
        </motion.div>

        {upcomingPayments.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/20 rounded-2xl p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-400">Pagos próximos</h3>
                <p className="text-sm text-orange-400/80 mt-1">
                  Tienes {upcomingPayments.length} pago{upcomingPayments.length > 1 ? 's' : ''} programado{upcomingPayments.length > 1 ? 's' : ''} para los próximos 7 días.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Mis Suscripciones</h2>
            <div className="flex items-center space-x-2">
              <Button onClick={() => navigate('/import')} variant="outline" size="icon">
                <Upload className="w-4 h-4" />
              </Button>
              <Button onClick={() => navigate('/add')} className="gradient-bg hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>
          </div>

          {activeSubscriptions.length > 0 && (
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
              <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0"/>
              {categories.map(cat => (
                <Button key={cat} variant={filter === cat ? 'default' : 'secondary'} size="sm" onClick={() => setFilter(cat)}
                  className={`capitalize rounded-full ${filter === cat ? 'gradient-bg text-white' : ''}`}>
                  {cat === 'shared' && <Users className="w-4 h-4 mr-1.5"/>}
                  {cat === 'all' ? 'Todas' : (cat === 'shared' ? 'Compartidas' : cat)}
                </Button>
              ))}
            </div>
          )}

          {filteredSubscriptions.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center py-12">
              <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-border">
                <CreditCard className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {activeSubscriptions.length === 0 ? "No tienes suscripciones" : "Sin suscripciones que coincidan"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {activeSubscriptions.length === 0 ? "Comienza agregando tu primera suscripción" : "Prueba seleccionando otro filtro."}
              </p>
              {activeSubscriptions.length === 0 && (
                 <Button onClick={() => navigate('/add')} className="gradient-bg hover:opacity-90">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar suscripción
                  </Button>
              )}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubscriptions.map((subscription, index) => (
                <motion.div key={subscription.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index }}>
                  <SubscriptionCard subscription={subscription} onClick={() => navigate(`/subscription/${subscription.id}`)}/>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;