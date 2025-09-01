import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Calendar, CreditCard, DollarSign, Tag, FileText, Users, Link, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useSubscriptions } from '@/contexts/SubscriptionContext';
import { toast } from '@/components/ui/use-toast';

const AddSubscription = () => {
  const navigate = useNavigate();
  const { addSubscription } = useSubscriptions();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    frequency: 'monthly',
    paymentMethod: 'credit_card',
    billingDate: '',
    currency: 'USD',
    category: 'entretenimiento',
    notes: '',
    isShared: false,
    sharedWith: [],
    isIncluded: false,
    includedWith: ''
  });

  const popularServices = [
    { name: 'Netflix', price: '15.99', icon: '🎬', category: 'entretenimiento' },
    { name: 'Spotify', price: '9.99', icon: '🎵', category: 'música' },
    { name: 'Canva Pro', price: '12.99', icon: '🎨', category: 'trabajo' },
    { name: 'YouTube Premium', price: '11.99', icon: '📺', category: 'entretenimiento' },
    { name: 'Disney+', price: '7.99', icon: '🏰', category: 'entretenimiento' },
    { name: 'HBO Max', price: '14.99', icon: '🎭', category: 'entretenimiento' }
  ];

  const frequencies = [ { value: 'weekly', label: 'Semanal' }, { value: 'monthly', label: 'Mensual' }, { value: 'yearly', label: 'Anual' } ];
  const paymentMethods = [ { value: 'credit_card', label: 'Tarjeta de Crédito' }, { value: 'debit_card', label: 'Tarjeta de Débito' }, { value: 'paypal', label: 'PayPal' }, { value: 'bank_transfer', label: 'Transferencia Bancaria' }, { value: 'cash', label: 'Efectivo' } ];
  const categories = ['entretenimiento', 'trabajo', 'educación', 'música', 'utilidades', 'otro'];

  const handleServiceSelect = (service) => {
    setFormData({ ...formData, name: service.name, price: service.price, category: service.category });
  };

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
    if (!formData.name || (!formData.isIncluded && (!formData.price || !formData.billingDate))) {
      toast({ title: "Campos requeridos", description: "Por favor completa todos los campos obligatorios", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      addSubscription({ ...formData, price: parseFloat(formData.price) || 0 });
      navigate('/');
    } catch (error) {
      toast({ title: "Error", description: "No se pudo agregar la suscripción. Intenta nuevamente.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 z-40 glass-effect p-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Agregar Suscripción</h1>
            <p className="text-sm text-muted-foreground">Añade un nuevo servicio</p>
          </div>
        </div>
      </motion.header>

      <div className="p-4 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-lg font-semibold text-foreground mb-4">Servicios Populares</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {popularServices.map((service, index) => (
              <motion.button key={service.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * index }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleServiceSelect(service)} className="card-gradient rounded-xl p-4 text-left hover:bg-secondary transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{service.icon}</span>
                  <div>
                    <p className="font-medium text-foreground text-sm">{service.name}</p>
                    <p className="text-emerald-400 text-xs">${service.price}/mes</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-gradient rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-muted-foreground">Nombre del servicio *</Label>
              <Input id="name" type="text" placeholder="Ej: Netflix, Spotify..." value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-secondary text-foreground placeholder:text-muted-foreground" required/>
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
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-muted-foreground">Precio *</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input id="price" type="number" step="0.01" placeholder="0.00" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="pl-10 bg-secondary text-foreground placeholder:text-muted-foreground" required/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currency" className="text-muted-foreground">Moneda</Label>
                            <select id="currency" value={formData.currency} onChange={(e) => setFormData({...formData, currency: e.target.value})} className="w-full h-10 px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                                <option value="USD">USD</option><option value="EUR">EUR</option><option value="MXN">MXN</option><option value="ARS">ARS</option><option value="COP">COP</option><option value="CLP">CLP</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="frequency" className="text-muted-foreground">Frecuencia de pago</Label>
                        <select id="frequency" value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})} className="w-full h-10 px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                            {frequencies.map((freq) => <option key={freq.value} value={freq.value}>{freq.label}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="billingDate" className="text-muted-foreground">Fecha de cobro *</Label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input id="billingDate" type="date" value={formData.billingDate} onChange={(e) => setFormData({...formData, billingDate: e.target.value})} className="pl-10 bg-secondary text-foreground" required/>
                        </div>
                    </div>
                </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-muted-foreground">Categoría</Label>
              <div className="relative">
                 <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                 <select id="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full h-10 pl-10 pr-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring capitalize">
                  {categories.map(cat => <option key={cat} value={cat} className="capitalize">{cat}</option>)}
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="text-muted-foreground">Método de pago</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <select id="paymentMethod" value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} className="w-full h-10 pl-10 pr-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {paymentMethods.map((method) => <option key={method.value} value={method.value}>{method.label}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-muted-foreground">Notas (opcional)</Label>
               <div className="relative">
                <FileText className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                <textarea id="notes" placeholder="Ej: Usar para el trabajo, Cobra a Juan el 10" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full h-20 pl-10 pr-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"/>
               </div>
            </div>

            {!formData.isIncluded && (
                <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center space-x-2">
                        <Switch id="isShared" checked={formData.isShared} onCheckedChange={(checked) => setFormData({...formData, isShared: checked})} />
                        <Label htmlFor="isShared">¿Es una suscripción compartida?</Label>
                    </div>
                    {formData.isShared && (
                        <div className="space-y-3">
                            {formData.sharedWith.map((person, index) => (
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

            <Button type="submit" className="w-full gradient-bg hover:opacity-90 transition-opacity" disabled={isLoading}>
              {isLoading ? ( <motion.div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}/> ) : ( <><Plus className="w-4 h-4 mr-2" /> Agregar Suscripción</> )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddSubscription;