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
  LogOut,
  Droplet,
  TrendingUp,
  CircleUserRound,
  PieChart,
  ClipboardList
} from 'lucide-react';

const DashboardOverview = () => {
  const recentLeads = [
    { name: 'Rahul Kumar', email: 'rahul@tech.com', source: 'Website', status: 'New', statusClass: 'status-new', assignee: 'Sam Sales' },
    { name: 'Sophia Lee', email: 'sophia@startup.io', source: 'Referral', status: 'Contacted', statusClass: 'status-contacted', assignee: 'Sam Sales' },
    { name: 'Mark Evans', email: 'mark@bigcorp.com', source: 'Cold Call', status: 'Interested', statusClass: 'status-interested', assignee: 'Jake Johnson' },
    { name: 'Nisha Reddy', email: 'nisha@enterprise.in', source: 'Social Media', status: 'Qualified', statusClass: 'status-qualified', assignee: 'Priya Patel' },
  ];

  const revenueData = [
    { month: 'Jan', height: '40%' },
    { month: 'Feb', height: '60%' },
    { month: 'Mar', height: '55%' },
    { month: 'Apr', height: '70%' },
    { month: 'May', height: '80%' },
    { month: 'Jul', height: '55%' },
    { month: 'Jun', height: '85%' },
    { month: 'Aug', height: '100%' },
  ];

  return (
    <div>
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fce7f3', color: '#db2777' }}>
            <CircleUserRound size={24} />
          </div>
          <div className="stat-label">Total Users</div>
          <div className="stat-value">6</div>
          <div className="stat-subtext">Active accounts</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <Users size={24} />
          </div>
          <div className="stat-label">Total Leads</div>
          <div className="stat-value">5</div>
          <div className="stat-subtext">All sources</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <Droplet size={24} />
          </div>
          <div className="stat-label">Total Deals</div>
          <div className="stat-value">3</div>
          <div className="stat-subtext">1 won</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">₹1,50,000</div>
          <div className="stat-subtext">From won deals</div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-panel">
          <h3 className="panel-title">Recent Leads</h3>
          <table className="leads-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Source</th>
                <th>Status</th>
                <th>Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead, index) => (
                <tr key={index}>
                  <td>
                    <div className="lead-name">{lead.name}</div>
                    <div className="lead-email">{lead.email}</div>
                  </td>
                  <td>
                    <div className="lead-source">{lead.source}</div>
                  </td>
                  <td>
                    <span className={`status-badge ${lead.statusClass}`}>{lead.status}</span>
                  </td>
                  <td>
                    <div className="lead-assignee">{lead.assignee}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dashboard-panel">
          <h3 className="panel-title">Monthly Revenue</h3>
          <div className="chart-container">
            {revenueData.map((data, index) => (
              <div key={index} className="chart-bar-group">
                <div className="chart-bar" style={{ height: data.height }}></div>
                <div className="chart-label">{data.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

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

const DealsManagement = () => (
  <div>
    <h2 className="page-title">Deals Management</h2>
    <div className="card">Manage and track your deals.</div>
  </div>
);

const TaskManagement = () => (
  <div>
    <h2 className="page-title">Task Management</h2>
    <div className="card">Organize your daily tasks.</div>
  </div>
);

const ReportAnalysis = () => (
  <div>
    <h2 className="page-title">Reports & Analysis</h2>
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
    { path: '/dashboard/deals', label: 'Deals Management', icon: PieChart },
    { path: '/dashboard/tasks', label: 'Task Management', icon: ClipboardList },
    { path: '/dashboard/reports', label: 'Reports & Analysis', icon: BarChart },
    { path: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Dashboard</h2>
          <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
             <div style={{width: 36, height: 36, borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600'}}>A</div>
             <div style={{display: 'flex', flexDirection: 'column'}}>
               <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Admin User</span>
               <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Administrator</span>
             </div>
          </div>
        </header>

        <div className="content-area">
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
