import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Magnet, Users, Briefcase, CheckSquare, FileText, LogOut } from 'lucide-react';
import './SalesDashboard.css';
import { useSettings } from '../context/SettingsContext';

const SalesLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const userStr = localStorage.getItem('user');
  const loggedInUser = userStr ? JSON.parse(userStr) : null;
  const displayName = loggedInUser?.name || 'Morgan Sales';
  const displayRole = 'Sales';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const { rolePermissions } = useSettings();

  const getPermission = (name) => {
    if (!rolePermissions) return true; // Default allow if not loaded
    const perm = rolePermissions.find(p => p.name === name);
    return perm ? perm.salesperson : true;
  };

  const navItems = [
    { path: '/sales', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    getPermission('View Leads') && { path: '/sales/leads', label: 'My Leads', icon: <Magnet size={20} /> },
    { path: '/sales/contacts', label: 'Contacts', icon: <Users size={20} /> },
    getPermission('View Deals') && { path: '/sales/deals', label: 'Deals', icon: <Briefcase size={20} /> },
    getPermission('Task Management') && { path: '/sales/tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { path: '/sales/notes', label: 'Notes', icon: <FileText size={20} /> },
  ].filter(Boolean);

  const currentNavItem = navItems.find(item => location.pathname === item.path) || navItems[0];
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="sales-dashboard-layout">
      <aside className="sales-sidebar">
        <div className="sales-sidebar-header" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.2rem', borderBottom: '1px solid #334155', marginBottom: '1rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', display: 'block' }}>
            <span style={{ color: '#3b82f6' }}>CRM</span>
            <span style={{ color: '#94a3b8' }}>Pro</span>
          </h1>
          <span style={{ color: '#94a3b8', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: '600', textTransform: 'uppercase' }}>SALESPERSON</span>
        </div>

        <nav className="sales-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/sales' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sales-nav-item ${isActive ? 'active' : ''}`}
              >
                <span style={{ display: 'flex', alignItems: 'center', marginRight: '0.75rem' }}>{Icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button onClick={handleLogout} className="sales-logout-btn" style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', marginRight: '0.75rem' }}><LogOut size={20} /></span>
          Logout
        </button>
      </aside>

      <main className="sales-main-content">
        <header className="sales-header">
          <h2>{currentNavItem.label}</h2>
          
          <div className="sales-profile">
            <div className="sales-profile-info">
              <span className="sales-avatar">{avatarLetter}</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span className="sales-profile-name" style={{ color: '#475569', fontWeight: '500' }}>{displayName}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="sales-content-area">
          {navItems.some(item => location.pathname === item.path || (item.path !== '/sales' && location.pathname.startsWith(item.path))) ? children : (
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

export default SalesLayout;
