import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const Feedback = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast({
        title: "Campo vacío",
        description: "Por favor escribe tu sugerencia antes de enviar.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    // Simular envío
    setTimeout(() => {
      setIsLoading(false);
      setFeedback('');
      toast({
        title: "¡Gracias por tu sugerencia!",
        description: "Hemos recibido tus comentarios y los valoramos mucho.",
      });
      navigate('/');
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
          <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Sugerencias</h1>
            <p className="text-sm text-muted-foreground">Ayúdanos a mejorar la app</p>
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
              <Label htmlFor="feedback" className="text-muted-foreground">
                Tu opinión es muy importante para nosotros. ¿Qué te gustaría ver en la app o cómo podemos mejorar?
              </Label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Escribe aquí tus ideas..."
                className="mt-2 w-full h-40 p-3 bg-secondary border border-border rounded-md text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            
            <Button type="submit" className="w-full gradient-bg hover:opacity-90" disabled={isLoading}>
              {isLoading ? (
                <motion.div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Sugerencia
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Feedback;