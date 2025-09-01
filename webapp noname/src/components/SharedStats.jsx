import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useSubscriptions } from '@/contexts/SubscriptionContext';

const SharedStats = () => {
    const navigate = useNavigate();
    const { getSharedPeopleSummary } = useSubscriptions();
    const sharedSummary = getSharedPeopleSummary();

    return (
        <div className="min-h-screen pb-20">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-40 glass-effect p-4"
            >
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/stats')} className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-lg font-bold text-foreground">Resumen Compartido</h1>
                        <p className="text-sm text-muted-foreground">Con quién y cuánto compartes</p>
                    </div>
                </div>
            </motion.header>

            <div className="p-4 space-y-6">
                {sharedSummary.length === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
                        <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-border">
                            <Users className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground">No hay nada compartido</h2>
                        <p className="text-muted-foreground mt-2">Marca una suscripción como compartida para ver estadísticas aquí.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.1 }}
                    >
                        {sharedSummary.map((person, index) => (
                            <motion.div
                                key={person.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card-gradient rounded-2xl p-6 mb-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                                            <Users className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-foreground">{person.name}</h3>
                                            <p className="text-sm text-muted-foreground">{person.count} servicio{person.count > 1 ? 's' : ''} compartido{person.count > 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-emerald-400">${person.totalAmount.toFixed(2)}</p>
                                        <p className="text-xs text-muted-foreground">Total aportado</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SharedStats;