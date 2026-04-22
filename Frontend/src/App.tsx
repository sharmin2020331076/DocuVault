import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Vault from './pages/Vault';
import Landing from './pages/Landing';
import Notifications from './pages/Notifications';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

const App = () => {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
            />
            <Route 
              path="/vault" 
              element={<ProtectedRoute><Vault /></ProtectedRoute>} 
            />
            <Route 
              path="/notifications" 
              element={<ProtectedRoute><Notifications /></ProtectedRoute>} 
            />
            <Route path="/" element={<Layout><Landing /></Layout>} />
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
};

export default App;
