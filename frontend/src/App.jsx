import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, SignupPage, VerifyEmailPage, OtpPage, CreatePasswordPage } from './pages/AuthPages';
import Dashboard from './pages/Dashboard';
import { SettingsProvider } from './context/SettingsContext';

import ManagerLayout from './pages/ManagerLayout';
import ManagerOverview from './pages/manager/ManagerOverview';
import TeamManagement from './pages/manager/TeamManagement';
import ManagerLeads from './pages/manager/ManagerLeads';
import ManagerContacts from './pages/manager/ManagerContacts';
import ManagerDeals from './pages/manager/ManagerDeals';
import ManagerTasks from './pages/manager/ManagerTasks';
import ManagerReports from './pages/manager/ManagerReports';

import SalesLayout from './pages/SalesLayout';
import SalesOverview from './pages/sales/SalesOverview';
import SalesLeads from './pages/sales/SalesLeads';
import SalesContacts from './pages/sales/SalesContacts';
import SalesDeals from './pages/sales/SalesDeals';
import SalesTasks from './pages/sales/SalesTasks';
import SalesNotes from './pages/sales/SalesNotes';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <SettingsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/create-password" element={<CreatePasswordPage />} />
          
          <Route path="/dashboard/*" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/manager" element={
            <ProtectedRoute allowedRoles={['ROLE_MANAGER']}>
              <ManagerLayout><ManagerOverview /></ManagerLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/team" element={
            <ProtectedRoute allowedRoles={['ROLE_MANAGER']}>
              <ManagerLayout><TeamManagement /></ManagerLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/leads" element={
            <ProtectedRoute allowedRoles={['ROLE_MANAGER']}>
              <ManagerLayout><ManagerLeads /></ManagerLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/contacts" element={
            <ProtectedRoute allowedRoles={['ROLE_MANAGER']}>
              <ManagerLayout><ManagerContacts /></ManagerLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/deals" element={
            <ProtectedRoute allowedRoles={['ROLE_MANAGER']}>
              <ManagerLayout><ManagerDeals /></ManagerLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/tasks" element={
            <ProtectedRoute allowedRoles={['ROLE_MANAGER']}>
              <ManagerLayout><ManagerTasks /></ManagerLayout>
            </ProtectedRoute>
          } />
          <Route path="/manager/reports" element={
            <ProtectedRoute allowedRoles={['ROLE_MANAGER']}>
              <ManagerLayout><ManagerReports /></ManagerLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/sales" element={
            <ProtectedRoute allowedRoles={['ROLE_SALES']}>
              <SalesLayout><SalesOverview /></SalesLayout>
            </ProtectedRoute>
          } />
          <Route path="/sales/leads" element={
            <ProtectedRoute allowedRoles={['ROLE_SALES']}>
              <SalesLayout><SalesLeads /></SalesLayout>
            </ProtectedRoute>
          } />
          <Route path="/sales/contacts" element={
            <ProtectedRoute allowedRoles={['ROLE_SALES']}>
              <SalesLayout><SalesContacts /></SalesLayout>
            </ProtectedRoute>
          } />
          <Route path="/sales/deals" element={
            <ProtectedRoute allowedRoles={['ROLE_SALES']}>
              <SalesLayout><SalesDeals /></SalesLayout>
            </ProtectedRoute>
          } />
          <Route path="/sales/tasks" element={
            <ProtectedRoute allowedRoles={['ROLE_SALES']}>
              <SalesLayout><SalesTasks /></SalesLayout>
            </ProtectedRoute>
          } />
          <Route path="/sales/notes" element={
            <ProtectedRoute allowedRoles={['ROLE_SALES']}>
              <SalesLayout><SalesNotes /></SalesLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </SettingsProvider>
  );
}

export default App;
