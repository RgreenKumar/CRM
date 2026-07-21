import { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

import DashboardOverview from './dashboard/DashboardOverview';
import UserManagement from './dashboard/UserManagement';
import RolesPermissions from './dashboard/RolesPermissions';
import LeadsManagement from './dashboard/LeadsManagement';
import ContactManagement from './dashboard/ContactManagement';
import DealsManagement from './dashboard/DealsManagement';
import TaskManagement from './dashboard/TaskManagement';
import ReportAnalysis from './dashboard/ReportAnalysis';
import AppSettings from './dashboard/AppSettings';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🖥️' },
    { path: '/dashboard/users', label: 'User Management', icon: '👥' },
    { path: '/dashboard/roles', label: 'Roles & Permissions', icon: '🏅' },
    { path: '/dashboard/leads', label: 'Leads Management', icon: '💡' },
    { path: '/dashboard/contacts', label: 'Contact Management', icon: '📇' },
    { path: '/dashboard/deals', label: 'Deals Management', icon: '🤝' },
    { path: '/dashboard/tasks', label: 'Task Management', icon: '📋' },
    { path: '/dashboard/reports', label: 'Reports & Analysis', icon: '📊' },
    { path: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
  ];

  const currentNavItem = navItems.find(item => location.pathname === item.path) || navItems[0];

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>C</div>
          <h1>CRM<span>ADMIN</span></h1>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <span style={{ fontSize: '1.25rem' }}>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>{currentNavItem.label}</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>A</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Admin User</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Administrator</span>
            </div>
          </div>
        </header>

        <div className="main-content-scroll">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/roles" element={<RolesPermissions />} />
            <Route path="/leads" element={<LeadsManagement />} />
            <Route path="/contacts" element={<ContactManagement />} />
            <Route path="/deals" element={<DealsManagement />} />
            <Route path="/tasks" element={<TaskManagement />} />
            <Route path="/reports" element={<ReportAnalysis />} />
            <Route path="/settings" element={<AppSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
