import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, CreditCard, DollarSign, Tag, FileText, Users, Link, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSubscriptions } from '@/contexts/SubscriptionContext';

const EditSubscriptionModal = ({ subscription, onClose }) => {
  const { updateSubscription } = useSubscriptions();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: subscription.name,
    price: subscription.price.toString(),
    frequency: subscription.frequency,
    paymentMethod: subscription.paymentMethod,
    billingDate: subscription.billingDate ? new Date(subscription.billingDate).toISOString().split('T')[0] : '',
    currency: subscription.currency || 'USD',
    category: subscription.category || 'entretenimiento',
    notes: subscription.notes || '',
    isShared: subscription.isShared || false,
    sharedWith: subscription.sharedWith || [],
    isIncluded: subscription.isIncluded || false,
    includedWith: subscription.includedWith || ''
  });

  const frequencies = [ { value: 'weekly', label: 'Semanal' }, { value: 'monthly', label: 'Mensual' }, { value: 'yearly', label: 'Anual' } ];
  const paymentMethods = [ { value: 'credit_card', label: 'Tarjeta de Crédito' }, { value: 'debit_card', label: 'Tarjeta de Débito' }, { value: 'paypal', label: 'PayPal' }, { value: 'bank_transfer', label: 'Transferencia Bancaria' }, { value: 'cash', label: 'Efectivo' } ];
  const categories = ['entretenimiento', 'trabajo', 'educación', 'música', 'utilidades', 'otro'];

  const handleAddPerson = () => {
    setFormData({ ...formData, sharedWith: [...formData.sharedWith, { id: Date.now(), name: '', amount: 0 }] });
  };

  const handleRemovePerson = (id) => {
    setFormData({ ...formData, sharedWith: formData.sharedWith.filter(p => p.id !== id) });
  };

  const handlePersonChange = (id, field, value) => {
    const updatedPeople = formData.sharedWith.map(p => p.id === id ? { ...p, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : p);
    setFormData({ ...formData, sharedWith: updatedPeople });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      updateSubscription(subscription.id, { ...formData, price: parseFloat(formData.price) || 0 });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card border border-border rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Editar Suscripción</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-muted-foreground">Nombre del servicio</Label>
            <Input id="name" type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="bg-secondary text-foreground" required />
          </div>

          <div className="flex items-center space-x-2">
              <Switch id="isIncluded" checked={formData.isIncluded} onCheckedChange={(checked) => setFormData({...formData, isIncluded: checked, price: checked ? '0' : formData.price})} />
              <Label htmlFor="isIncluded">Incluida con otro servicio</Label>
          </div>

          {formData.isIncluded ? (
              <div className="space-y-2">
                  <Label htmlFor="includedWith" className="text-muted-foreground">Incluida con</Label>
                  <div className="relative">
                      <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input id="includedWith" type="text" placeholder="Ej: Plan de celular" value={formData.includedWith} onChange={(e) => setFormData({...formData, includedWith: e.target.value})} className="pl-10 bg-secondary text-foreground placeholder:text-muted-foreground" />
                  </div>
              </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-muted-foreground">Precio</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="pl-10 bg-secondary text-foreground" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-muted-foreground">Moneda</Label>
                  <select id="currency" value={formData.currency} onChange={(e) => setFormData({...formData, currency: e.target.value})}
                    className="w-full h-10 px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="USD">USD</option><option value="EUR">EUR</option><option value="MXN">MXN</option><option value="ARS">ARS</option><option value="COP">COP</option><option value="CLP">CLP</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency" className="text-muted-foreground">Frecuencia</Label>
                <select id="frequency" value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                  className="w-full h-10 px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {frequencies.map((freq) => <option key={freq.value} value={freq.value}>{freq.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingDate" className="text-muted-foreground">Fecha de cobro</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input id="billingDate" type="date" value={formData.billingDate} onChange={(e) => setFormData({...formData, billingDate: e.target.value})}
                    className="pl-10 bg-secondary text-foreground" required/>
                </div>
              </div>
            </>
          )}

           <div className="space-y-2">
              <Label htmlFor="category" className="text-muted-foreground">Categoría</Label>
              <div className="relative">
                 <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                 <select id="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full h-10 pl-10 pr-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring capitalize">
                  {categories.map(cat => <option key={cat} value={cat} className="capitalize">{cat}</option>)}
                </select>
              </div>
            </div>
          
          <div className="space-y-2">
            <Label htmlFor="paymentMethod" className="text-muted-foreground">Método de pago</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <select id="paymentMethod" value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                className="w-full h-10 pl-10 pr-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {paymentMethods.map((method) => <option key={method.value} value={method.value}>{method.label}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-muted-foreground">Notas</Label>
             <div className="relative">
              <FileText className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
              <textarea id="notes" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full h-16 px-3 py-2 pl-10 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Notas adicionales..."/>
            </div>
          </div>

          {!formData.isIncluded && (
            <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center space-x-2">
                    <Switch id="isShared" checked={formData.isShared} onCheckedChange={(checked) => setFormData({...formData, isShared: checked})} />
                    <Label htmlFor="isShared">Suscripción compartida</Label>
                </div>
                {formData.isShared && (
                    <div className="space-y-3">
                        {formData.sharedWith.map((person) => (
                            <div key={person.id} className="grid grid-cols-12 gap-2 items-center">
                                <Input type="text" placeholder="Nombre" value={person.name} onChange={(e) => handlePersonChange(person.id, 'name', e.target.value)} className="col-span-6 bg-secondary" />
                                <Input type="number" placeholder="Aporte" value={person.amount === 0 ? '' : person.amount} onChange={(e) => handlePersonChange(person.id, 'amount', e.target.value)} className="col-span-4 bg-secondary" />
                                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemovePerson(person.id)} className="col-span-2 text-red-500"><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={handleAddPerson} className="w-full"><Plus className="w-4 h-4 mr-2" />Añadir persona</Button>
                    </div>
                )}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button type="button" onClick={onClose} variant="secondary" className="flex-1">Cancelar</Button>
            <Button type="submit" className="flex-1 gradient-bg hover:opacity-90" disabled={isLoading}>
              {isLoading ? ( <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}/>) : ('Guardar')}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditSubscriptionModal;