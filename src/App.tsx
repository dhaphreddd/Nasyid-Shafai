import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { DetailPage } from './pages/DetailPage';
import { LoginPage } from './pages/LoginPage';
import { AdminAddEditPage } from './pages/AdminAddEditPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/add"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminAddEditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminAddEditPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
