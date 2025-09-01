import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useSubscriptions } from '@/contexts/SubscriptionContext';
import { toast } from '@/components/ui/use-toast';

const Import = () => {
  const navigate = useNavigate();
  const { addSubscription } = useSubscriptions();
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) {
      toast({
        title: "Campo vacío",
        description: "Por favor pega el texto a importar.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Lógica de parsing simple (esto es un ejemplo y puede necesitar mejoras)
    const lines = text.split('\n');
    let addedCount = 0;
    lines.forEach(line => {
        // Intenta encontrar un nombre y un precio
        const priceMatch = line.match(/(\$|USD|\€|EUR)\s?(\d+[.,]\d+)/);
        if (priceMatch) {
            const price = parseFloat(priceMatch[2].replace(',', '.'));
            // Elimina el precio para obtener el nombre
            let name = line.replace(priceMatch[0], '').trim();
            // Limpia caracteres comunes
            name = name.replace(/[-*:]/g, '').trim();

            if (name && price > 0) {
                addSubscription({
                    name: name,
                    price: price,
                    frequency: 'monthly', // Asume mensual por defecto
                    billingDate: new Date().toISOString().split('T')[0], // Hoy por defecto
                    currency: 'USD',
                    category: 'otro',
                    notes: `Importado el ${new Date().toLocaleDateString()}`
                });
                addedCount++;
            }
        }
    });

    setTimeout(() => {
      setIsLoading(false);
      if (addedCount > 0) {
        toast({
          title: "¡Importación completada!",
          description: `Se agregaron ${addedCount} nuevas suscripciones.`,
        });
        navigate('/');
      } else {
        toast({
          title: "No se pudo importar",
          description: "No se encontraron suscripciones válidas en el texto. Asegúrate de que cada línea tenga un nombre y un precio (ej: Netflix $15.99).",
          variant: "destructive"
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen">
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
            <h1 className="text-lg font-bold text-foreground">Importación Rápida</h1>
            <p className="text-sm text-muted-foreground">Pega texto para agregar suscripciones</p>
          </div>
        </div>
      </motion.header>

      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-gradient rounded-2xl p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="import-text" className="text-muted-foreground">
                Pega aquí el texto de tu resumen de tarjeta o email. Intentaremos detectar el nombre y el precio de cada suscripción.
              </Label>
              <p className="text-xs text-muted-foreground mt-1 mb-2">Ejemplo: <span className="italic">Netflix $15.99</span></p>
              <textarea
                id="import-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Spotify Premium $9.99&#10;Canva Pro $12.95&#10;..."
                className="mt-2 w-full h-48 p-3 bg-secondary border border-border rounded-md text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            
            <Button type="submit" className="w-full gradient-bg hover:opacity-90" disabled={isLoading}>
              {isLoading ? (
                <motion.div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Importar Suscripciones
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Import;