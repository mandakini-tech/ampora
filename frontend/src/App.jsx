import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/layout/Layout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ConsumersPage } from './pages/ConsumersPage';
import { MeterReadingPage } from './pages/MeterReadingPage';
import { BillGenerationPage } from './pages/BillGenerationPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { ConsumerPortalPage } from './pages/ConsumerPortalPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { ReportsPage } from './pages/ReportsPage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';
import { ConsumerBillsPage } from './pages/ConsumerBillsPage';
import { ConsumerComplaintsPage } from './pages/ConsumerComplaintsPage';
import { ConsumerMeterReadingsPage } from './pages/ConsumerMeterReadingsPage';
import { ConsumerPaymentsPage } from './pages/ConsumerPaymentsPage';

// Protected Route Guard component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useApp();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to={currentUser.role === 'Consumer' ? '/consumer-portal' : '/dashboard'} replace />;
  }
  return <Layout>{children}</Layout>;
};

const RoleAwarePage = ({ consumerPage, staffPage }) => {
  const { currentUser } = useApp();
  return currentUser?.role === 'Consumer' ? consumerPage : staffPage;
};

const STAFF_ROLES = ['Administrator', 'Billing Staff', 'Field Officer'];
const BILLING_ROLES = ['Administrator', 'Billing Staff'];
const BILLING_PAGE_ROLES = [...BILLING_ROLES, 'Consumer'];
const COMPLAINT_PAGE_ROLES = [...STAFF_ROLES, 'Consumer'];

// Root index redirect based on role
const RootRedirect = () => {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === 'Consumer') return <Navigate to="/consumer-portal" replace />;
  return <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<RootRedirect />} />

          {/* Authenticated Application Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={STAFF_ROLES}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consumers"
            element={
              <ProtectedRoute allowedRoles={STAFF_ROLES}>
                <ConsumersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meter-readings"
            element={
              <ProtectedRoute allowedRoles={COMPLAINT_PAGE_ROLES}>
                <RoleAwarePage
                  consumerPage={<ConsumerMeterReadingsPage />}
                  staffPage={<MeterReadingPage />}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bills"
            element={
              <ProtectedRoute allowedRoles={BILLING_PAGE_ROLES}>
                <RoleAwarePage
                  consumerPage={<ConsumerBillsPage />}
                  staffPage={<BillGenerationPage />}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute allowedRoles={BILLING_PAGE_ROLES}>
                <RoleAwarePage
                  consumerPage={<ConsumerPaymentsPage />}
                  staffPage={<PaymentsPage />}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consumer-portal"
            element={
              <ProtectedRoute allowedRoles={['Consumer']}>
                <ConsumerPortalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/complaints"
            element={
              <ProtectedRoute allowedRoles={COMPLAINT_PAGE_ROLES}>
                <RoleAwarePage
                  consumerPage={<ConsumerComplaintsPage />}
                  staffPage={<ComplaintsPage />}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['Administrator']}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['Administrator']}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['Administrator']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
