import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import FundiDashboard from './pages/FundiDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import WhatsAppBot from './pages/WhatsAppBot';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Dashboard Router Component
const DashboardRouter = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'fundi':
      return <Navigate to="/fundi" replace />;
    case 'customer':
      return <Navigate to="/customer" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/whatsapp-bot" element={<WhatsAppBot />} />
            
            {/* Dashboard Router */}
            <Route path="/dashboard" element={<DashboardRouter />} />
            
            {/* Protected Role-Based Routes */}
            {/* <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            /> */}

            <Route path="/admin" element={<AdminDashboard />} />
            {/* <Route path="/fundi" element={<FundiDashboard />} /> */}
            <Route path="/customer" element={<CustomerDashboard />} />



            <Route 
              path="/fundi" 
              element={
                <ProtectedRoute allowedRoles={['fundi']}>
                  <FundiDashboard />
                </ProtectedRoute>
              } 
            />
            {/* <Route 
              path="/customer" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            /> */}
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;