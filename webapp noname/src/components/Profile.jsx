import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, LogOut, MessageSquare, Sun, Moon, BarChart, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useSubscriptions } from '@/contexts/SubscriptionContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from '@/components/ui/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { subscriptions, getMonthlyTotal } = useSubscriptions();

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const exportToCSV = () => {
    const activeSubs = subscriptions.filter(s => s.status === 'active');
    if (activeSubs.length === 0) {
        toast({ title: "Sin datos", description: "No hay suscripciones activas para exportar.", variant: "destructive" });
        return;
    }
    const headers = ['Nombre', 'Precio', 'Moneda', 'Frecuencia', 'Categoría', 'Próximo Pago'];
    const rows = activeSubs.map(sub => [
        sub.name,
        sub.price,
        sub.currency,
        sub.frequency,
        sub.category,
        new Date(sub.nextPayment).toLocaleDateString('es-ES')
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mis_suscripciones.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Exportación CSV iniciada", description: "Tu archivo se está descargando." });
  };

  const exportToPDF = () => {
    const activeSubs = subscriptions.filter(s => s.status === 'active');
    if (activeSubs.length === 0) {
        toast({ title: "Sin datos", description: "No hay suscripciones activas para exportar.", variant: "destructive" });
        return;
    }
    const doc = new jsPDF();
    const monthlyTotal = getMonthlyTotal();

    doc.text("Resumen de Suscripciones", 14, 20);
    doc.setFontSize(12);
    doc.text(`Usuario: ${user.name}`, 14, 30);
    doc.text(`Gasto Mensual Total: $${monthlyTotal.toFixed(2)}`, 14, 36);

    const tableColumn = ["Nombre", "Precio", "Frecuencia", "Categoría", "Próximo Pago"];
    const tableRows = [];

    activeSubs.forEach(sub => {
        const subData = [
            sub.name,
            `$${sub.price.toFixed(2)} ${sub.currency}`,
            sub.frequency,
            sub.category,
            new Date(sub.nextPayment).toLocaleDateString('es-ES')
        ];
        tableRows.push(subData);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 45,
    });
    
    doc.save("mis_suscripciones.pdf");
    toast({ title: "Exportación PDF iniciada", description: "Tu archivo se está generando." });
  };

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
            <h1 className="text-lg font-bold text-foreground">Perfil</h1>
            <p className="text-sm text-muted-foreground">Gestiona tu cuenta y preferencias</p>
          </div>
        </div>
      </motion.header>

      <div className="p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-gradient rounded-2xl p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-gradient rounded-2xl p-4"
        >
          <h3 className="text-lg font-semibold text-foreground mb-2 px-2">General</h3>
          <div className="space-y-1">
            <button onClick={() => navigate('/stats')} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors text-left">
              <div className="flex items-center space-x-3">
                <BarChart className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">Estadísticas</span>
              </div>
              <span className="text-muted-foreground">›</span>
            </button>
             <button onClick={() => navigate('/feedback')} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors text-left">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">Enviar sugerencias</span>
              </div>
              <span className="text-muted-foreground">›</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-gradient rounded-2xl p-4"
        >
          <h3 className="text-lg font-semibold text-foreground mb-2 px-2">Exportar Datos</h3>
          <div className="space-y-1">
            <button onClick={exportToPDF} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors text-left">
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">Exportar a PDF</span>
              </div>
              <span className="text-muted-foreground">›</span>
            </button>
            <button onClick={exportToCSV} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors text-left">
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">Exportar a CSV</span>
              </div>
              <span className="text-muted-foreground">›</span>
            </button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-gradient rounded-2xl p-4"
        >
          <h3 className="text-lg font-semibold text-foreground mb-2 px-2">Apariencia</h3>
          <div className="space-y-1">
            <div className="w-full flex items-center justify-between p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                {theme === 'dark' ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
                <span className="text-foreground">Modo {theme === 'dark' ? 'Oscuro' : 'Claro'}</span>
              </div>
              <button onClick={handleThemeToggle} className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-secondary">
                  <span className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-emerald-500 rounded-full transition-transform`}/>
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button onClick={logout} variant="outline" className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-400">
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;