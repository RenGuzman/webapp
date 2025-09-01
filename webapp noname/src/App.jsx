import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import LoginScreen from '@/components/LoginScreen';
import Dashboard from '@/components/Dashboard';
import AddSubscription from '@/components/AddSubscription';
import SubscriptionDetail from '@/components/SubscriptionDetail';
import Profile from '@/components/Profile';
import ProtectedRoute from '@/components/ProtectedRoute';
import Stats from '@/components/Stats';
import Feedback from '@/components/Feedback';
import Onboarding from '@/components/Onboarding';
import Import from '@/components/Import';
import SharedStats from '@/components/SharedStats';

function App() {
  return (
    <>
      <Helmet>
        <title>MisSuscripciones - Gestiona tus suscripciones digitales</title>
        <meta name="description" content="La mejor app para gestionar, organizar y optimizar tus suscripciones digitales como Netflix, Spotify, Canva y más." />
        <meta property="og:title" content="MisSuscripciones - Gestiona tus suscripciones digitales" />
        <meta property="og:description" content="La mejor app para gestionar, organizar y optimizar tus suscripciones digitales como Netflix, Spotify, Canva y más." />
      </Helmet>
      
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <SubscriptionProvider>
              <div className="min-h-screen">
                <Routes>
                  <Route path="/login" element={<LoginScreen />} />
                  <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/add" element={<ProtectedRoute><AddSubscription /></ProtectedRoute>} />
                  <Route path="/import" element={<ProtectedRoute><Import /></ProtectedRoute>} />
                  <Route path="/subscription/:id" element={<ProtectedRoute><SubscriptionDetail /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/stats" element={<ProtectedRoute><Stats /></ProtectedRoute>} />
                  <Route path="/shared-stats" element={<ProtectedRoute><SharedStats /></ProtectedRoute>} />
                  <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
                  <Route path="/welcome" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                </Routes>
              </div>
              <Toaster />
            </SubscriptionProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;