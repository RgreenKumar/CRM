import { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

const DashboardOverview = ({ users }) => {
  const activeUsersCount = users.filter(u => u.status === 'Active').length;
  const totalLeadsCount = users.length;

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
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ width: '36px', height: '36px', background: '#f3e8ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              🧑‍🤝‍🧑
            </div>
          </div>
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{activeUsersCount}</div>
          <div className="stat-subtext">Active accounts</div>
        </div>
        <div className="stat-card">
          <div style={{ marginBottom: '1rem', height: '36px', display: 'flex', alignItems: 'center', fontSize: '32px' }}>
            👥
          </div>
          <div className="stat-label">Total Leads</div>
          <div className="stat-value">{totalLeadsCount}</div>
          <div className="stat-subtext">All sources</div>
        </div>
        <div className="stat-card">
          <div style={{ marginBottom: '1rem', height: '36px', display: 'flex', alignItems: 'center', fontSize: '32px' }}>
            🔥
          </div>
          <div className="stat-label">Total Deals</div>
          <div className="stat-value">3</div>
          <div className="stat-subtext">1 won</div>
        </div>
        <div className="stat-card">
          <div style={{ marginBottom: '1rem', height: '36px', display: 'flex', alignItems: 'center', fontSize: '32px' }}>
            📈
          </div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">₹1,50,000</div>
          <div className="stat-subtext">From won deals</div>
        </div>
        <div className="stat-card">
          <div style={{ marginBottom: '1rem', height: '36px', display: 'flex', alignItems: 'center', fontSize: '32px' }}>
            ⭐
          </div>
          <div className="stat-label">Conversion Rate</div>
          <div className="stat-value">24.5%</div>
          <div className="stat-subtext">Up 2% this month</div>
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

const UserManagement = ({ users, setUsers }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalState, setModalState] = useState({ type: null, user: null }); // type can be 'add', 'edit', 'delete'

  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Sales User', status: 'Active' });

  const openModal = (type, user = null) => {
    setModalState({ type, user });
    if (user) {
      setFormData({ name: user.name, email: user.email, role: user.role, status: user.status });
    } else {
      setFormData({ name: '', email: '', role: 'Sales User', status: 'Active' });
    }
  };

  const closeModal = () => setModalState({ type: null, user: null });

  const handleSave = () => {
    if (modalState.type === 'add') {
      const newUser = { ...formData, id: Date.now() };
      setUsers([...users, newUser]);
    } else if (modalState.type === 'edit') {
      setUsers(users.map(u => u.id === modalState.user.id ? { ...u, ...formData } : u));
    }
    closeModal();
  };

  const handleDelete = () => {
    setUsers(users.filter(u => u.id !== modalState.user.id));
    closeModal();
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="dashboard-panel">
      <div className="users-header">
        <div className="users-header-info">
          <h2>Users</h2>
          <p>Manage user accounts and access</p>
        </div>
        <div className="users-actions">
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => openModal('add')}>+ Add User</button>
        </div>
      </div>

      <table className="leads-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td><div className="lead-name">{user.name}</div></td>
              <td><div className="lead-email">{user.email}</div></td>
              <td>{user.role}</td>
              <td>
                <span className={`status-badge ${user.status === 'Active' ? 'status-qualified' : 'status-inactive'}`}>
                  {user.status}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button className="btn btn-outline" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }} onClick={() => openModal('edit', user)}>Edit</button>
                  <button className="btn btn-danger" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }} onClick={() => openModal('delete', user)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add / Edit Modal */}
      {(modalState.type === 'add' || modalState.type === 'edit') && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{modalState.type === 'add' ? 'Add User' : 'Edit User'}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john.doe@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Role *</label>
              <select className="form-select" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                <option value="Admin">Admin</option>
                <option value="Sales Manager">Sales Manager</option>
                <option value="Sales User">Sales User</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status *</label>
              <select className="form-select" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{modalState.type === 'add' ? 'Save' : 'Update'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalState.type === 'delete' && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '400px' }}>
            <div className="modal-header" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ backgroundColor: '#fef08a', color: '#854d0e', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>!</div>
                <h3>Delete User</h3>
              </div>
            </div>
            <p style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '1rem', paddingLeft: '3rem' }}>
              Are you sure you want to delete ? This action cannot be undone.
            </p>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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

  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Sarah Smith', email: 'sarah.smith@example.com', role: 'Sales Manager', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', role: 'Sales User', status: 'Active' },
    { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', role: 'Sales User', status: 'Inactive' },
    { id: 5, name: 'David Brown', email: 'david.brown@example.com', role: 'Sales User', status: 'Active' },
  ]);

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

        <div className="content-area">
          <Routes>
            <Route path="/" element={<DashboardOverview users={users} />} />
            <Route path="/users" element={<UserManagement users={users} setUsers={setUsers} />} />
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
