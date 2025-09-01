import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BarChart, Tag } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    navigate('/');
  };

  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-emerald-400" />,
      title: "Todo en un solo lugar",
      description: "Agrega todas tus suscripciones para tener una vista clara de tus gastos."
    },
    {
      icon: <Tag className="h-8 w-8 text-blue-400" />,
      title: "Organiza con etiquetas",
      description: "Usa categorías para agrupar tus servicios de entretenimiento, trabajo y más."
    },
    {
      icon: <BarChart className="h-8 w-8 text-purple-400" />,
      title: "Estadísticas útiles",
      description: "Visualiza tus gastos mensuales y descubre cuál es tu suscripción más cara."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md text-center"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-white">MS</span>
        </div>
        <h1 className="text-3xl font-bold text-gradient mb-4">
          ¡Bienvenido a MisSuscripciones!
        </h1>
        <p className="text-muted-foreground mb-8">
          Toma el control de tus gastos recurrentes. Aquí tienes un vistazo rápido de lo que puedes hacer:
        </p>

        <div className="space-y-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 * (index + 1), duration: 0.5 }}
              className="flex items-start text-left space-x-4"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-card rounded-xl flex items-center justify-center">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button
            onClick={handleComplete}
            className="w-full gradient-bg hover:opacity-90 transition-opacity"
            size="lg"
          >
            ¡Empezar ahora!
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Onboarding;