import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart2, CreditCard, Star, TrendingUp, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useSubscriptions } from '@/contexts/SubscriptionContext';

const Stats = () => {
  const navigate = useNavigate();
  const { subscriptions, getMonthlyNetTotal, getMostExpensiveSubscription, getOldestSubscription } = useSubscriptions();

  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const nonIncludedSubs = activeSubs.filter(s => !s.isIncluded);

  const monthlyTotal = getMonthlyNetTotal();
  const mostExpensive = getMostExpensiveSubscription();
  const oldestSub = getOldestSubscription();
  const totalSubscriptions = activeSubs.length;
  const yearlyTotal = monthlyTotal * 12;

  const getUserShare = (sub) => {
    if (!sub || sub.isIncluded) return 0;
    const othersShare = sub.isShared ? sub.sharedWith.reduce((sum, p) => sum + p.amount, 0) : 0;
    return sub.price - othersShare;
  };
  
  const getCategoryData = () => {
    const categoryMap = nonIncludedSubs.reduce((acc, sub) => {
      const category = sub.category || 'otro';
      if (!acc[category]) {
        acc[category] = { count: 0, total: 0 };
      }
      acc[category].count++;
      
      let userShare = getUserShare(sub);
      let monthlyPrice = userShare;

      if (sub.frequency === 'yearly') monthlyPrice /= 12;
      if (sub.frequency === 'weekly') monthlyPrice *= 4.33;
      
      acc[category].total += monthlyPrice;
      return acc;
    }, {});

    return Object.entries(categoryMap).map(([name, data]) => ({ name, ...data }));
  };

  const categoryData = getCategoryData();
  const topSpendingCategories = [...categoryData].sort((a, b) => b.total - a.total).slice(0, 3);
  
  const topSpendingSubs = [...nonIncludedSubs].sort((a, b) => {
    const priceA = getUserShare(a);
    const priceB = getUserShare(b);
    return priceB - priceA;
  }).slice(0, 3);

  const StatCard = ({ icon, label, value, subValue, colorClass, delay, onClick }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={`card-gradient rounded-2xl p-6 ${onClick ? 'cursor-pointer hover:bg-secondary' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="text-2xl font-bold text-foreground truncate">{value}</p>
          {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
        </div>
        <div className={`w-12 h-12 ${colorClass}/20 rounded-xl flex items-center justify-center flex-shrink-0`}>
          {React.cloneElement(icon, { className: `w-6 h-6 text-${colorClass}` })}
        </div>
      </div>
    </motion.div>
  );

  const timeDiff = oldestSub ? new Date() - new Date(oldestSub.createdAt) : 0;
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  let oldestSubAge = '';
  if (years > 0) oldestSubAge = `${years} año${years > 1 ? 's' : ''}`;
  else if (months > 0) oldestSubAge = `${months} mes${months > 1 ? 'es' : ''}`;
  else oldestSubAge = `${days} día${days > 1 ? 's' : ''}`;

  const sharedSubscriptionsCount = activeSubs.filter(s => s.isShared).length;

  return (
    <div className="min-h-screen pb-20">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass-effect p-4"
      >
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Estadísticas</h1>
            <p className="text-sm text-muted-foreground">Tu resumen de suscripciones</p>
          </div>
        </div>
      </motion.header>

      <div className="p-4 space-y-6">
        {totalSubscriptions === 0 ? (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-border">
                <BarChart2 className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Sin datos para mostrar</h2>
              <p className="text-muted-foreground mt-2">Agrega algunas suscripciones para ver tus estadísticas.</p>
           </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard icon={<CreditCard />} label="Tu gasto mensual real" value={`$${monthlyTotal.toFixed(2)}`} colorClass="emerald-400" delay={0.1} />
              <StatCard icon={<TrendingUp />} label="Suscripciones activas" value={totalSubscriptions} colorClass="blue-400" delay={0.2} />
              <StatCard icon={<Users />} label="Suscripciones compartidas" value={sharedSubscriptionsCount} onClick={() => navigate('/shared-stats')} colorClass="cyan-400" delay={0.25} />
              <StatCard icon={<Star />} label="Tu suscripción más cara" value={mostExpensive ? mostExpensive.name : '-'} subValue={mostExpensive ? `Tu parte: $${getUserShare(mostExpensive).toFixed(2)}` : ''} colorClass="purple-400" delay={0.3} />
              <StatCard icon={<Clock />} label="Suscripción más antigua" value={oldestSub ? oldestSub.name : '-'} subValue={oldestSub ? `Activa por ${oldestSubAge}` : ''} colorClass="orange-400" delay={0.4} />
            </div>

             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card-gradient rounded-2xl p-6">
               <h3 className="text-lg font-semibold text-foreground mb-4">Tu Gasto Anual Estimado</h3>
                <div className="flex items-baseline space-x-2">
                    <p className="text-4xl font-bold text-gradient">${yearlyTotal.toFixed(2)}</p>
                    <span className="text-muted-foreground">/ año</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Basado en tu gasto mensual real.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card-gradient rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Top 3 Suscripciones (Tu parte)</h3>
                <div className="space-y-3">
                  {topSpendingSubs.map((sub, index) => (
                     <div key={sub.id} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{index + 1}. {sub.name}</span>
                        <span className="text-sm font-bold text-emerald-400">${getUserShare(sub).toFixed(2)}</span>
                     </div>
                  ))}
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="card-gradient rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Gasto por Categoría (Tu parte)</h3>
                <div className="space-y-4">
                  {topSpendingCategories.map((cat) => (
                     <div key={cat.name}>
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-sm font-medium text-foreground capitalize">{cat.name}</span>
                           <span className="text-sm text-muted-foreground">${cat.total.toFixed(2)}/mes</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2.5">
                           <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${(cat.total / monthlyTotal) * 100}%` }}></div>
                        </div>
                     </div>
                  ))}
                </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Stats;