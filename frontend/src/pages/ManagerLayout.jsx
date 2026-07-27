import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Lightbulb, Contact, Handshake, ClipboardList, BarChart2, LogOut } from 'lucide-react';
import './ManagerDashboard.css';
import { useSettings } from '../context/SettingsContext';

import ManagerOverview from './manager/ManagerOverview';
import TeamManagement from './manager/TeamManagement';
import ManagerLeads from './manager/ManagerLeads';
import ManagerContacts from './manager/ManagerContacts';
import ManagerDeals from './manager/ManagerDeals';
import ManagerTasks from './manager/ManagerTasks';
import ManagerReports from './manager/ManagerReports';

const ManagerLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const userStr = localStorage.getItem('user');
  const loggedInUser = userStr ? JSON.parse(userStr) : null;
  const displayName = loggedInUser?.name || 'Morgan Manager';
  const displayRole = 'Manager';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const { rolePermissions } = useSettings();

  const getPermission = (name) => {
    if (!rolePermissions) return true; // Default allow if not loaded
    const perm = rolePermissions.find(p => p.name === name);
    return perm ? perm.manager : true;
  };

  const navItems = [
    { path: '/manager', label: 'Dashboard', icon: LayoutDashboard },
    getPermission('Manage Users') && { path: '/manager/team', label: 'Team Management', icon: Users },
    getPermission('View Leads') && { path: '/manager/leads', label: 'Leads', icon: Lightbulb },
    { path: '/manager/contacts', label: 'Contacts', icon: Contact },
    getPermission('View Deals') && { path: '/manager/deals', label: 'Deals', icon: Handshake },
    getPermission('Task Management') && { path: '/manager/tasks', label: 'Tasks', icon: ClipboardList },
    getPermission('View Reports') && { path: '/manager/reports', label: 'Reports', icon: BarChart2 },
  ].filter(Boolean);

  const currentNavItem = navItems.find(item => location.pathname === item.path) || navItems[0];
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="manager-dashboard-layout">
      <aside className="manager-sidebar">
        <div className="manager-sidebar-header" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.2rem', borderBottom: '1px solid #334155', marginBottom: '1rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', display: 'block' }}>
            <span style={{ color: '#3b82f6' }}>CRM</span>
            <span style={{ color: '#94a3b8' }}>Pro</span>
          </h1>
          <span style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: '600' }}>MANAGER</span>
        </div>

        <nav className="manager-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/manager' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`manager-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button onClick={handleLogout} className="manager-logout-btn">
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      <main className="manager-main-content">
        <header className="manager-header">
          <h2>{currentNavItem.label}</h2>
          
          <div className="manager-profile">
            <div className="manager-profile-info">
              <span className="manager-avatar">{avatarLetter}</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span className="manager-profile-name">{displayName}</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>Manager</span>
              </div>
            </div>
          </div>
        </header>

        <div className="manager-content-area">
          {navItems.some(item => location.pathname === item.path || (item.path !== '/manager' && location.pathname.startsWith(item.path))) ? children : (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1e293b' }}>Access Denied</h3>
              <p>You do not have permission to view this page. Please contact the administrator.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManagerLayout;
