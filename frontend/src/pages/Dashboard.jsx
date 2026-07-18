import { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Target, 
  Contact, 
  BarChart, 
  Settings, 
  LogOut 
} from 'lucide-react';

const DashboardOverview = () => (
  <div>
    <h2 className="page-title">Dashboard Overview</h2>
    <div className="card">Welcome to Scale CRM Dashboard. Here is your summary.</div>
  </div>
);

const UserManagement = () => (
  <div>
    <h2 className="page-title">User Management</h2>
    <div className="card">Manage your platform users here.</div>
  </div>
);

const RolesPermissions = () => (
  <div>
    <h2 className="page-title">Roles & Permissions</h2>
    <div className="card">Configure access control and roles.</div>
  </div>
);

const LeadsManagement = () => (
  <div>
    <h2 className="page-title">Leads Management</h2>
    <div className="card">Track and manage your leads.</div>
  </div>
);

const ContactManagement = () => (
  <div>
    <h2 className="page-title">Contact Management</h2>
    <div className="card">Organize and connect with your contacts.</div>
  </div>
);

const ReportAnalysis = () => (
  <div>
    <h2 className="page-title">Report & Analysis</h2>
    <div className="card">View detailed reports and analytics.</div>
  </div>
);

const AppSettings = () => (
  <div>
    <h2 className="page-title">Settings</h2>
    <div className="card">System configurations.</div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/users', label: 'User Management', icon: Users },
    { path: '/dashboard/roles', label: 'Roles & Permissions', icon: ShieldCheck },
    { path: '/dashboard/leads', label: 'Leads Management', icon: Target },
    { path: '/dashboard/contacts', label: 'Contact Management', icon: Contact },
    { path: '/dashboard/reports', label: 'Report & Analysis', icon: BarChart },
    { path: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>S</div>
          <h1>Scale CRM</h1>
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
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div style={{color: 'var(--text-secondary)'}}>Welcome back, Admin</div>
          <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
             <div style={{width: 36, height: 36, borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600'}}>A</div>
          </div>
        </header>

        <div className="content-area">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/roles" element={<RolesPermissions />} />
            <Route path="/leads" element={<LeadsManagement />} />
            <Route path="/contacts" element={<ContactManagement />} />
            <Route path="/reports" element={<ReportAnalysis />} />
            <Route path="/settings" element={<AppSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
