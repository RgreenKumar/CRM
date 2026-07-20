import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

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
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ width: '36px', height: '36px', background: '#f3e8ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              🧑‍🤝‍🧑
            </div>
          </div>
          <div className="stat-label">Total Users</div>
          <div className="stat-value">6</div>
          <div className="stat-subtext">Active accounts</div>
        </div>
        <div className="stat-card">
          <div style={{ marginBottom: '1rem', height: '36px', display: 'flex', alignItems: 'center', fontSize: '32px' }}>
            👥
          </div>
          <div className="stat-label">Total Leads</div>
          <div className="stat-value">5</div>
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

const UserManagement = () => {
  // --- MOCK DATA (works without backend) ---
  const MOCK_MODE = true; // set false when Spring Boot is running

  const MOCK_USERS_INIT = [
    { id: 1, fullName: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
    { id: 2, fullName: 'Bob Smith', email: 'bob@example.com', role: 'Sales User', status: 'Active' },
    { id: 3, fullName: 'Charlie Brown', email: 'charlie@example.com', role: 'Manager', status: 'Inactive' },
    { id: 4, fullName: 'Diana Prince', email: 'diana@example.com', role: 'Sales User', status: 'Active' },
    { id: 5, fullName: 'Ethan Hunt', email: 'ethan@example.com', role: 'Support', status: 'Active' },
    { id: 6, fullName: 'Fiona Green', email: 'fiona@example.com', role: 'Sales User', status: 'Inactive' },
  ];
  // --- END MOCK DATA ---

  const [users, setUsers] = useState(MOCK_MODE ? MOCK_USERS_INIT : []);
  const [loading, setLoading] = useState(!MOCK_MODE);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [nextId, setNextId] = useState(7);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Selected user for edit/delete
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Sales User');
  const [status, setStatus] = useState('Active');
  const [formError, setFormError] = useState('');

  const fetchUsers = async () => {
    if (MOCK_MODE) return; // skip — using in-memory data
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setError('Failed to fetch users.');
      }
    } catch (err) {
      setError('Network error. Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!MOCK_MODE) fetchUsers();
  }, []);

  const openAddModal = () => {
    setFullName('');
    setEmail('');
    setRole('Sales User');
    setStatus('Active');
    setFormError('');
    setShowAddModal(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFullName(user.fullName || '');
    setEmail(user.email || '');
    setRole(user.role || 'Sales User');
    setStatus(user.status || 'Active');
    setFormError('');
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim()) { setFormError('Full Name is required'); return; }
    if (!email.trim()) { setFormError('Email is required'); return; }

    if (MOCK_MODE) {
      const newUser = { id: nextId, fullName, email, role, status };
      setUsers(prev => [...prev, newUser]);
      setNextId(n => n + 1);
      setShowAddModal(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: fullName, email, role, status })
      });
      if (res.ok) { setShowAddModal(false); fetchUsers(); }
      else { const data = await res.json(); setFormError(data.message || 'Failed to add user'); }
    } catch (err) { setFormError('Network error. Please try again.'); }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim()) { setFormError('Full Name is required'); return; }
    if (!email.trim()) { setFormError('Email is required'); return; }

    if (MOCK_MODE) {
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, fullName, email, role, status } : u));
      setShowEditModal(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: fullName, email, role, status })
      });
      if (res.ok) { setShowEditModal(false); fetchUsers(); }
      else { const data = await res.json(); setFormError(data.message || 'Failed to update user'); }
    } catch (err) { setFormError('Network error. Please try again.'); }
  };

  const handleDeleteConfirm = async () => {
    if (MOCK_MODE) {
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      setShowDeleteModal(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) { setShowDeleteModal(false); fetchUsers(); }
      else { alert('Failed to delete user.'); }
    } catch (err) { alert('Network error. Failed to delete user.'); }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    const nameMatch = (user.fullName || '').toLowerCase().includes(term);
    const emailMatch = (user.email || '').toLowerCase().includes(term);
    const roleMatch = (user.role || '').toLowerCase().includes(term);
    return nameMatch || emailMatch || roleMatch;
  });

  return (
    <div className="user-management-page">
      <div className="card user-mgmt-card">
        <div className="user-mgmt-header">
          <div className="header-info">
            <h3 className="users-title">Users</h3>
            <p className="users-subtitle">Manage user accounts and access</p>
          </div>
          <div className="header-actions">
            <div className="search-wrapper">
              <input 
                type="text" 
                placeholder="Search..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn-add-user" onClick={openAddModal}>
              <span className="plus-icon">+</span> Add User
            </button>
          </div>
        </div>

        {loading ? (
          <div className="user-mgmt-loading">Loading users...</div>
        ) : error ? (
          <div className="user-mgmt-error">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-table-row">No users found.</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="user-name-cell">{user.fullName || user.email.split('@')[0]}</td>
                      <td className="user-email-cell">{user.email}</td>
                      <td className="user-role-cell">{user.role}</td>
                      <td>
                        <span className={`status-pill ${user.status?.toLowerCase() === 'active' ? 'active' : 'inactive'}`}>
                          {user.status || 'Active'}
                        </span>
                      </td>
                      <td className="user-actions-cell">
                        <button className="btn-edit-action" onClick={() => openEditModal(user)}>Edit</button>
                        <button className="btn-delete-action" onClick={() => openDeleteModal(user)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Add User</h3>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            {formError && <div className="modal-error-banner">{formError}</div>}
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="modal-form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-form-group">
                  <label>Email *</label>
                  <input 
                    type="email" 
                    placeholder="john.doe@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-form-group">
                  <label>Role *</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="Admin">Admin</option>
                    <option value="Sales Manager">Sales Manager</option>
                    <option value="Sales User">Sales User</option>
                  </select>
                </div>
                <div className="modal-form-group">
                  <label>Status *</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-save">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit User</h3>
              <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            {formError && <div className="modal-error-banner">{formError}</div>}
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="modal-form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-form-group">
                  <label>Email *</label>
                  <input 
                    type="email" 
                    placeholder="john.doe@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-form-group">
                  <label>Role *</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="Admin">Admin</option>
                    <option value="Sales Manager">Sales Manager</option>
                    <option value="Sales User">Sales User</option>
                  </select>
                </div>
                <div className="modal-form-group">
                  <label>Status *</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn-save">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-backdrop">
          <div className="modal-card delete-modal-card">
            <div className="delete-modal-body">
              <div className="delete-warning-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 18.01H12.01" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0V3.86Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="delete-text-content">
                <h3>Delete User</h3>
                <p>Are you sure you want to delete ? This action cannot be undone.</p>
              </div>
            </div>
            <div className="modal-footer delete-modal-footer">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn-delete" onClick={handleDeleteConfirm}>Delete</button>
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
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
          <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
             <div style={{width: 36, height: 36, borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', textTransform: 'uppercase'}}>
               {currentUser ? (currentUser.fullName ? currentUser.fullName.charAt(0) : currentUser.email.charAt(0)) : 'A'}
             </div>
             <div style={{display: 'flex', flexDirection: 'column'}}>
               <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                 {currentUser ? (currentUser.fullName || currentUser.email) : 'Admin User'}
               </span>
               <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                 {currentUser ? (currentUser.role === 'Admin' ? 'Administrator' : currentUser.role) : 'Administrator'}
               </span>
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
