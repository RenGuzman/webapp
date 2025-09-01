import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Trash2, Calendar, CreditCard, DollarSign, AlertCircle, Tag, FileText, Users, Pause, Play, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useSubscriptions } from '@/contexts/SubscriptionContext';
import EditSubscriptionModal from '@/components/EditSubscriptionModal';
import { toast } from '@/components/ui/use-toast';

const SubscriptionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { subscriptions, deleteSubscription, updateSubscription, calculateNextPayment } = useSubscriptions();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const subscription = subscriptions.find(sub => sub.id === id);

  if (!subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Suscripción no encontrada</h2>
          <Button onClick={() => navigate('/')} className="gradient-bg">Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const formatFrequency = (frequency) => ({ weekly: 'Semanal', monthly: 'Mensual', yearly: 'Anual' }[frequency] || frequency);
  const formatPaymentMethod = (method) => ({ credit_card: 'Tarjeta de Crédito', debit_card: 'Tarjeta de Débito', paypal: 'PayPal', bank_transfer: 'Transferencia Bancaria', cash: 'Efectivo' }[method] || method);

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

  const isUpcoming = () => {
    if (subscription.status !== 'active') return false;
    const nextPayment = new Date(subscription.nextPayment);
    const today = new Date();
    const diffTime = nextPayment - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const handleDelete = () => {
    deleteSubscription(subscription.id);
    navigate('/');
  };

  const handleTogglePause = () => {
    const newStatus = subscription.status === 'active' ? 'paused' : 'active';
    const updates = { status: newStatus };
    if (newStatus === 'active') {
        updates.nextPayment = calculateNextPayment(subscription.billingDate, subscription.frequency);
    }
    updateSubscription(id, updates);
    toast({
        title: `Suscripción ${newStatus === 'active' ? 'reactivada' : 'pausada'}`,
        description: `${subscription.name} ha sido ${newStatus === 'active' ? 'reactivada' : 'pausada'}.`
    });
  }

  const totalSharedAmount = subscription.sharedWith?.reduce((sum, person) => sum + person.amount, 0) || 0;
  const myShare = subscription.price - totalSharedAmount;

  return (
    <div className="min-h-screen pb-20">
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 z-40 glass-effect p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Detalles</h1>
              <p className="text-sm text-muted-foreground">{subscription.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={handleTogglePause} className="text-muted-foreground hover:text-foreground">
              {subscription.status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowEditModal(true)} className="text-muted-foreground hover:text-foreground">
              <Edit className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowDeleteConfirm(true)} className="text-muted-foreground hover:text-red-400">
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="p-4 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`subscription-card rounded-2xl p-6 relative overflow-hidden ${subscription.status === 'paused' ? 'opacity-60' : ''}`}>
          
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            {isUpcoming() && <div className="flex items-center space-x-2 bg-orange-500/20 px-3 py-1 rounded-full"><AlertCircle className="w-4 h-4 text-orange-400" /><span className="text-orange-400 text-sm font-medium">Próximo</span></div>}
            {subscription.status === 'paused' && <div className="flex items-center space-x-2 bg-yellow-500/20 px-3 py-1 rounded-full"><Pause className="w-4 h-4 text-yellow-400" /><span className="text-yellow-400 text-sm font-medium">Pausada</span></div>}
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="text-5xl">{getServiceIcon(subscription.name)}</div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">{subscription.name}</h2>
              <p className="text-muted-foreground capitalize">{subscription.category}</p>
            </div>
          </div>
          <div className="text-center mb-6">
            {subscription.isIncluded ? (
                <div className="flex flex-col items-center">
                    <CheckCircle className="w-10 h-10 text-emerald-400 mb-2" />
                    <p className="text-2xl font-bold text-foreground">Incluida con</p>
                    <p className="text-muted-foreground">{subscription.includedWith}</p>
                </div>
            ) : (
                <>
                    <p className="text-4xl font-bold text-emerald-400 mb-2">${subscription.price.toFixed(2)}</p>
                    <p className="text-muted-foreground">{subscription.currency || 'USD'} / {formatFrequency(subscription.frequency).toLowerCase()}</p>
                </>
            )}
          </div>
          <div className={`absolute bottom-0 left-0 right-0 h-2 ${subscription.status === 'paused' ? 'bg-yellow-500' : 'bg-gradient-to-r from-emerald-500 to-emerald-600'}`}></div>
        </motion.div>

        {subscription.isShared && !subscription.isIncluded && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-gradient rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <Users className="w-6 h-6 text-blue-400" />
                    <h3 className="text-lg font-semibold text-foreground">Suscripción Compartida</h3>
                </div>
                <div className="space-y-3">
                    {subscription.sharedWith.map(person => (
                        <div key={person.id} className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">{person.name}</span>
                            <span className="font-medium text-foreground">${person.amount.toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between items-center text-sm pt-2 border-t border-border">
                        <span className="text-muted-foreground">Tu parte</span>
                        <span className="font-bold text-emerald-400">${myShare.toFixed(2)}</span>
                    </div>
                </div>
            </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="card-gradient rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Información</h3>
          <div className="space-y-4">
            {subscription.status === 'active' && !subscription.isIncluded && (
                <div className="flex items-center justify-between py-3 border-b border-border">
                    <div className="flex items-center space-x-3"><Calendar className="w-5 h-5 text-muted-foreground" /><span className="text-muted-foreground">Próximo pago</span></div>
                    <span className="text-foreground font-medium">{new Date(subscription.nextPayment).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            )}
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center space-x-3"><CreditCard className="w-5 h-5 text-muted-foreground" /><span className="text-muted-foreground">Método de pago</span></div>
              <span className="text-foreground font-medium">{formatPaymentMethod(subscription.paymentMethod)}</span>
            </div>
            {!subscription.isIncluded && (
                <div className="flex items-center justify-between py-3 border-b border-border">
                    <div className="flex items-center space-x-3"><DollarSign className="w-5 h-5 text-muted-foreground" /><span className="text-muted-foreground">Frecuencia</span></div>
                    <span className="text-foreground font-medium">{formatFrequency(subscription.frequency)}</span>
                </div>
            )}
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center space-x-3"><Tag className="w-5 h-5 text-muted-foreground" /><span className="text-muted-foreground">Categoría</span></div>
              <span className="text-foreground font-medium capitalize">{subscription.category}</span>
            </div>
            {subscription.notes && (
              <div className="py-3">
                <div className="flex items-center space-x-3 mb-2"><FileText className="w-5 h-5 text-muted-foreground" /><span className="text-muted-foreground">Notas</span></div>
                <p className="text-foreground bg-secondary rounded-lg p-3">{subscription.notes}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {showEditModal && <EditSubscriptionModal subscription={subscription} onClose={() => setShowEditModal(false)} />}
      {showDeleteConfirm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={() => setShowDeleteConfirm(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card rounded-2xl p-6 max-w-sm w-full border border-border" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-foreground mb-4">¿Eliminar suscripción?</h3>
            <p className="text-muted-foreground mb-6">Esta acción no se puede deshacer. Se eliminará permanentemente la suscripción de {subscription.name}.</p>
            <div className="flex space-x-3">
              <Button onClick={() => setShowDeleteConfirm(false)} variant="secondary" className="flex-1">Cancelar</Button>
              <Button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white">Eliminar</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SubscriptionDetail;