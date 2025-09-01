import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const SubscriptionContext = createContext();

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptions debe ser usado dentro de SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = () => {
    try {
      const saved = localStorage.getItem('subscriptions');
      if (saved) {
        setSubscriptions(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSubscriptions = (subs) => {
    localStorage.setItem('subscriptions', JSON.stringify(subs));
    setSubscriptions(subs);
  };

  const addSubscription = (subscription) => {
    const newSubscription = {
      ...subscription,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      nextPayment: calculateNextPayment(subscription.billingDate, subscription.frequency),
      category: subscription.category || 'General',
      notes: subscription.notes || '',
      status: 'active',
      isShared: subscription.isShared || false,
      sharedWith: subscription.sharedWith || [],
      isIncluded: subscription.isIncluded || false,
      includedWith: subscription.includedWith || '',
    };
    
    const updated = [...subscriptions, newSubscription];
    saveSubscriptions(updated);
    
    toast({
      title: "¡Suscripción agregada!",
      description: `${subscription.name} ha sido agregada exitosamente`,
    });
    
    return newSubscription;
  };

  const updateSubscription = (id, updates) => {
    const updated = subscriptions.map(sub => 
      sub.id === id 
        ? { 
            ...sub, 
            ...updates, 
            nextPayment: (updates.billingDate || updates.frequency) && sub.status === 'active'
              ? calculateNextPayment(updates.billingDate || sub.billingDate, updates.frequency || sub.frequency)
              : sub.nextPayment
          }
        : sub
    );
    
    saveSubscriptions(updated);
    
    toast({
      title: "Suscripción actualizada",
      description: "Los cambios han sido guardados correctamente",
    });
  };

  const deleteSubscription = (id) => {
    const subscription = subscriptions.find(sub => sub.id === id);
    const updated = subscriptions.filter(sub => sub.id !== id);
    saveSubscriptions(updated);
    
    let savings = 0;
    if (subscription) {
        let userShare = subscription.price;
        if(subscription.isShared) {
            const othersShare = subscription.sharedWith.reduce((sum, person) => sum + person.amount, 0);
            userShare = subscription.price - othersShare;
        }

        switch (subscription.frequency) {
            case 'monthly': savings = userShare * 12; break;
            case 'yearly': savings = userShare; break;
            case 'weekly': savings = userShare * 52; break;
            default: savings = 0;
        }
    }

    toast({
      title: "Suscripción eliminada",
      description: `${subscription?.name} ha sido eliminada. ¡Ahorrarás ${savings.toFixed(2)} al año!`,
    });
  };

  const calculateNextPayment = (billingDate, frequency) => {
    if (!billingDate) return new Date().toISOString();
    const date = new Date(billingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    while (date < today) {
      switch (frequency) {
        case 'monthly':
          date.setMonth(date.getMonth() + 1);
          break;
        case 'yearly':
          date.setFullYear(date.getFullYear() + 1);
          break;
        case 'weekly':
          date.setDate(date.getDate() + 7);
          break;
        default:
          return date.toISOString();
      }
    }
    
    return date.toISOString();
  };

  const getMonthlyNetTotal = () => {
    return subscriptions.reduce((total, sub) => {
      if (sub.status !== 'active' || sub.isIncluded) return total;
      
      const othersShare = sub.isShared ? sub.sharedWith.reduce((sum, p) => sum + p.amount, 0) : 0;
      const userShare = sub.price - othersShare;

      let monthlyAmount = userShare;
      
      switch (sub.frequency) {
        case 'yearly':
          monthlyAmount = userShare / 12;
          break;
        case 'weekly':
          monthlyAmount = userShare * 4.33;
          break;
        default: // monthly
          monthlyAmount = userShare;
      }
      
      return total + monthlyAmount;
    }, 0);
  };

  const getUpcomingPayments = (days = 7) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    return subscriptions.filter(sub => {
      if (sub.status !== 'active') return false;
      const nextPayment = new Date(sub.nextPayment);
      return nextPayment >= today && nextPayment <= futureDate;
    }).sort((a, b) => new Date(a.nextPayment) - new Date(b.nextPayment));
  };
  
  const getMostExpensiveSubscription = () => {
    const activeSubs = subscriptions.filter(s => s.status === 'active' && !s.isIncluded);
    if (activeSubs.length === 0) return null;
    
    const getMonthlyPrice = (sub) => {
        let userShare = sub.price;
        if(sub.isShared) {
            const othersShare = sub.sharedWith.reduce((sum, p) => sum + p.amount, 0);
            userShare = sub.price - othersShare;
        }

        switch (sub.frequency) {
            case 'yearly': return userShare / 12;
            case 'weekly': return userShare * 4.33;
            default: return userShare;
        }
    }

    return activeSubs.reduce((max, sub) => getMonthlyPrice(sub) > getMonthlyPrice(max) ? sub : max, activeSubs[0]);
  };

  const getOldestSubscription = () => {
    const activeSubs = subscriptions.filter(s => s.status === 'active');
    if (activeSubs.length === 0) return null;
    return activeSubs.reduce((oldest, sub) => new Date(sub.createdAt) < new Date(oldest.createdAt) ? sub : oldest, activeSubs[0]);
  };
  
  const getSharedPeopleSummary = () => {
    const people = {};
    subscriptions.forEach(sub => {
        if(sub.isShared && sub.sharedWith && sub.sharedWith.length > 0) {
            sub.sharedWith.forEach(person => {
                if(person.name) {
                    if(!people[person.name]) {
                        people[person.name] = { count: 0, totalAmount: 0 };
                    }
                    people[person.name].count++;
                    people[person.name].totalAmount += person.amount;
                }
            });
        }
    });
    return Object.entries(people).map(([name, data]) => ({name, ...data})).sort((a,b) => b.count - a.count || b.totalAmount - a.totalAmount);
  };

  const value = {
    subscriptions,
    loading,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    getMonthlyNetTotal,
    getUpcomingPayments,
    getMostExpensiveSubscription,
    getOldestSubscription,
    getSharedPeopleSummary,
    calculateNextPayment
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};