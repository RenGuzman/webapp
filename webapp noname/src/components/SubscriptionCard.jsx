import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle, Users, PauseCircle, CheckCircle } from 'lucide-react';

const SubscriptionCard = ({ subscription, onClick }) => {
  const isUpcoming = () => {
    if (subscription.status !== 'active') return false;
    const nextPayment = new Date(subscription.nextPayment);
    const today = new Date();
    const diffTime = nextPayment - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const getServiceIcon = (name) => {
    const serviceName = name.toLowerCase();
    if (serviceName.includes('netflix')) return '🎬';
    if (serviceName.includes('spotify')) return '🎵';
    if (serviceName.includes('canva')) return '🎨';
    if (serviceName.includes('youtube')) return '📺';
    if (serviceName.includes('amazon')) return '📦';
    if (serviceName.includes('disney')) return '🏰';
    if (serviceName.includes('hbo')) return '🎭';
    if (serviceName.includes('apple')) return '🍎';
    if (serviceName.includes('google')) return '🔍';
    if (serviceName.includes('microsoft')) return '💻';
    return '📱';
  };

  const categoryColor = {
    'entretenimiento': 'bg-red-500',
    'trabajo': 'bg-blue-500',
    'educación': 'bg-yellow-500',
    'música': 'bg-green-500',
    'utilidades': 'bg-purple-500',
    'default': 'bg-gray-500'
  }

  const getCategoryColor = (category) => {
    const cat = category?.toLowerCase();
    return categoryColor[cat] || categoryColor['default'];
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`subscription-card rounded-2xl p-5 cursor-pointer relative overflow-hidden h-full flex flex-col justify-between ${subscription.status === 'paused' ? 'opacity-60' : ''}`}
    >
      <div>
        <div className="absolute top-3 right-3 flex items-center space-x-2">
            {subscription.isShared && <Users className="w-4 h-4 text-blue-400" />}
            {isUpcoming() && <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>}
            {subscription.status === 'paused' && <PauseCircle className="w-4 h-4 text-yellow-400" />}
        </div>

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">
              {getServiceIcon(subscription.name)}
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">
                {subscription.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                 <div className={`w-2 h-2 rounded-full ${getCategoryColor(subscription.category)}`}></div>
                 <p className="text-muted-foreground text-sm capitalize">{subscription.category}</p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            {subscription.isIncluded ? (
                <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-emerald-400">Incluida</span>
                    <span className="text-xs text-muted-foreground">{subscription.includedWith}</span>
                </div>
            ) : (
                <>
                    <p className="text-2xl font-bold text-emerald-400">
                    ${subscription.price.toFixed(2)}
                    </p>
                    <p className="text-muted-foreground text-xs">
                    {subscription.currency || 'USD'}
                    </p>
                </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        {subscription.status === 'active' ? (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                    Próximo pago: {new Date(subscription.nextPayment).toLocaleDateString('es-ES')}
                </span>
            </div>
        ) : (
            <div className="flex items-center space-x-2 text-sm text-yellow-400">
                <PauseCircle className="w-4 h-4" />
                <span>Pausada</span>
            </div>
        )}

        {isUpcoming() && (
          <div className="flex items-center space-x-2 text-sm text-orange-400">
            <AlertCircle className="w-4 h-4" />
            <span>Pago próximo</span>
          </div>
        )}
      </div>

      <div className={`absolute bottom-0 left-0 right-0 h-1 ${subscription.status === 'paused' ? 'bg-yellow-500' : 'bg-gradient-to-r from-emerald-500 to-emerald-600'}`}></div>
    </motion.div>
  );
};

export default SubscriptionCard;