import { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

const DashboardOverview = ({ users, leads = [], deals = [] }) => {
  const activeUsersCount = users.filter(u => u.status === 'Active').length;
  const activeLeads = leads.filter(l => l.status !== 'Not Interested');
  const totalLeadsCount = activeLeads.length;

  const recentLeads = activeLeads.slice(0, 4);

  const parseValue = (valStr) => {
    if (!valStr) return 0;
    const cleanStr = valStr.toString().replace(/,/g, '');
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
  };

  const formatCurrency = (num) => {
    return '₹' + num.toLocaleString('en-IN');
  };

  const totalDeals = deals.length;
  const wonDeals = deals.filter(d => d.stage === 'Won');
  const wonDealsCount = wonDeals.length;
  const totalRevenue = wonDeals.reduce((sum, d) => sum + parseValue(d.value), 0);
  
  const conversionRate = totalLeadsCount > 0 
    ? ((wonDealsCount / totalLeadsCount) * 100).toFixed(1) + '%'
    : '0%';

  const getStatusStyle = (status) => {
    switch (status) {
      case 'New': return { backgroundColor: '#dbeafe', color: '#3b82f6' };
      case 'Contacted': return { backgroundColor: '#ede9fe', color: '#8b5cf6' };
      case 'Interested': return { backgroundColor: '#ffedd5', color: '#f97316' };
      case 'Qualified': return { backgroundColor: '#dcfce7', color: '#22c55e' };
      case 'Not Interested': return { backgroundColor: '#fee2e2', color: '#ef4444' };
      default: return { backgroundColor: '#f3f4f6', color: '#6b7280' };
    }
  };

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
          <div className="stat-value">{totalDeals}</div>
          <div className="stat-subtext">{wonDealsCount} won</div>
        </div>
        <div className="stat-card">
          <div style={{ marginBottom: '1rem', height: '36px', display: 'flex', alignItems: 'center', fontSize: '32px' }}>
            📈
          </div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">{formatCurrency(totalRevenue)}</div>
          <div className="stat-subtext">From won deals</div>
        </div>
        <div className="stat-card">
          <div style={{ marginBottom: '1rem', height: '36px', display: 'flex', alignItems: 'center', fontSize: '32px' }}>
            ⭐
          </div>
          <div className="stat-label">Conversion Rate</div>
          <div className="stat-value">{conversionRate}</div>
          <div className="stat-subtext">Won deals / Active leads</div>
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
                    <span style={{ 
                      ...getStatusStyle(lead.status),
                      padding: '4px 12px', 
                      borderRadius: '9999px', 
                      fontSize: '12px', 
                      fontWeight: '500',
                      display: 'inline-block'
                    }}>{lead.status}</span>
                  </td>
                  <td>
                    <div className="lead-assignee">{lead.assignedTo}</div>
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

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || 
           u.email.toLowerCase().includes(q) || 
           u.role.toLowerCase().includes(q) || 
           u.status.toLowerCase().includes(q);
  });

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

const RolesPermissions = () => {
  const [permissions, setPermissions] = useState([
    { id: 1, name: 'View Leads', manager: true, salesperson: true },
    { id: 2, name: 'Assign Leads', manager: true, salesperson: false },
    { id: 3, name: 'View Deals', manager: true, salesperson: true },
    { id: 4, name: 'View Reports', manager: true, salesperson: false },
    { id: 5, name: 'Manage Users', manager: false, salesperson: false },
  ]);

  const togglePermission = (id, role) => {
    setPermissions(permissions.map(p => 
      p.id === id ? { ...p, [role]: !p[role] } : p
    ));
  };

  return (
    <div>
      <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#1f2937', fontWeight: '600' }}>Role Permissions</h3>
          <span style={{ color: '#9ca3af', fontSize: '13px' }}>Save the Changes</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', color: '#6b7280', fontSize: '11px', fontWeight: '600', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>PERMISSION</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>MANAGER</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>SALESPERSON</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px 24px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>{p.name}</td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={p.manager} 
                    onChange={() => togglePermission(p.id, 'manager')}
                    style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#3b82f6' }}
                  />
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={p.salesperson} 
                    onChange={() => togglePermission(p.id, 'salesperson')}
                    style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#3b82f6' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#fff' }}>
          <button style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)' }}>Save</button>
        </div>
      </div>
    </div>
  );
};

const LeadsManagement = ({ leads, setLeads }) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentLead, setCurrentLead] = useState({ name: '', email: '', phone: '', source: 'Website', status: 'New', assignedTo: '' });
  const [leadToDelete, setLeadToDelete] = useState(null);

  const filteredLeads = leads.filter(lead => {
    const query = searchQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.phone.toLowerCase().includes(query) ||
      lead.source.toLowerCase().includes(query) ||
      lead.status.toLowerCase().includes(query) ||
      lead.assignedTo.toLowerCase().includes(query)
    );
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'New': return { backgroundColor: '#dbeafe', color: '#3b82f6' };
      case 'Contacted': return { backgroundColor: '#ede9fe', color: '#8b5cf6' };
      case 'Interested': return { backgroundColor: '#ffedd5', color: '#f97316' };
      case 'Qualified': return { backgroundColor: '#dcfce7', color: '#22c55e' };
      case 'Not Interested': return { backgroundColor: '#fee2e2', color: '#ef4444' };
      default: return { backgroundColor: '#f3f4f6', color: '#6b7280' };
    }
  };

  const handleAddClick = () => {
    setModalType('add');
    setCurrentLead({ name: '', email: '', phone: '', source: 'Website', status: 'New', assignedTo: '' });
    setIsModalOpen(true);
  };

  const handleEditClick = (lead) => {
    setModalType('edit');
    setCurrentLead(lead);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (lead) => {
    setLeadToDelete(lead);
    setIsDeleteModalOpen(true);
  };

  const handleSaveLead = () => {
    if (modalType === 'add') {
      setLeads([...leads, { ...currentLead, id: Date.now() }]);
    } else {
      setLeads(leads.map(l => l.id === currentLead.id ? currentLead : l));
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    setLeads(leads.filter(l => l.id !== leadToDelete.id));
    setIsDeleteModalOpen(false);
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  return (
    <div>
      <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#1f2937', fontWeight: '600' }}>All Leads</h3>
          <div style={{ display: 'flex', gap: '16px' }}>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: '#f9fafb', fontSize: '14px', width: '250px', outline: 'none' }}
            />
            <button 
              onClick={handleAddClick}
              style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>+</span> Add Lead
            </button>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', color: '#6b7280', fontSize: '11px', fontWeight: '600', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>NAME</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>EMAIL</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>PHONE</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>SOURCE</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>STATUS</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>ASSIGNED TO</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px 24px', color: '#1f2937', fontSize: '14px', fontWeight: '600' }}>{lead.name}</td>
                <td style={{ padding: '16px 24px', color: '#6b7280', fontSize: '14px' }}>{lead.email}</td>
                <td style={{ padding: '16px 24px', color: '#6b7280', fontSize: '14px' }}>{lead.phone}</td>
                <td style={{ padding: '16px 24px', color: '#6b7280', fontSize: '14px' }}>{lead.source}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    ...getStatusStyle(lead.status),
                    padding: '4px 12px', 
                    borderRadius: '9999px', 
                    fontSize: '12px', 
                    fontWeight: '500' 
                  }}>
                    {lead.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', color: '#6b7280', fontSize: '14px' }}>{lead.assignedTo}</td>
                <td style={{ padding: '16px 24px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button onClick={() => handleEditClick(lead)} style={{ backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>Edit</button>
                  <button onClick={() => handleDeleteClick(lead)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ height: '32px' }}></div>
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', width: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                {modalType === 'add' ? 'Add Lead' : 'Edit Lead'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Name</label>
                <input 
                  type="text" 
                  value={currentLead.name} 
                  onChange={(e) => setCurrentLead({...currentLead, name: e.target.value})}
                  placeholder="Lead Name"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Email</label>
                <input 
                  type="email" 
                  value={currentLead.email} 
                  onChange={(e) => setCurrentLead({...currentLead, email: e.target.value})}
                  placeholder="Email"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Phone</label>
                <input 
                  type="text" 
                  value={currentLead.phone} 
                  onChange={(e) => setCurrentLead({...currentLead, phone: e.target.value})}
                  placeholder="Phone"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Source</label>
                <select 
                  value={currentLead.source} 
                  onChange={(e) => setCurrentLead({...currentLead, source: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}
                >
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Social Media">Social Media</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Status</label>
                <select 
                  value={currentLead.status} 
                  onChange={(e) => setCurrentLead({...currentLead, status: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Interested">Interested</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Not Interested">Not Interested</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Assign To</label>
                <select 
                  value={currentLead.assignedTo} 
                  onChange={(e) => setCurrentLead({...currentLead, assignedTo: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}
                >
                  <option value="">-- Select User --</option>
                  <option value="Sam Sales">Sam Sales</option>
                  <option value="Jake Johnson">Jake Johnson</option>
                  <option value="Priya Patel">Priya Patel</option>
                </select>
              </div>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#374151' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveLead}
                style={{ padding: '8px 16px', backgroundColor: '#3b82f6', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: 'white' }}
              >
                {modalType === 'add' ? 'Save' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ padding: '32px 24px 24px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <span style={{ color: '#d97706', fontSize: '24px' }}>⚠️</span>
              </div>
              <h2 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: '600', color: '#111827' }}>Delete lead</h2>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                Are you sure you want to delete ? This action cannot be undone.
              </p>
            </div>
            <div style={{ padding: '16px 24px 24px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                style={{ padding: '8px 24px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#374151' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                style={{ padding: '8px 24px', backgroundColor: '#ef4444', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: 'white' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ContactManagement = ({ contacts, setContacts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentContact, setCurrentContact] = useState({ name: '', email: '', phone: '', company: '', designation: '' });
  const [contactToDelete, setContactToDelete] = useState(null);

  const filteredContacts = contacts.filter(contact => {
    const query = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.phone.toLowerCase().includes(query) ||
      contact.company.toLowerCase().includes(query) ||
      contact.designation.toLowerCase().includes(query)
    );
  });

  const handleAddClick = () => {
    setModalType('add');
    setCurrentContact({ name: '', email: '', phone: '', company: '', designation: '' });
    setIsModalOpen(true);
  };

  const handleEditClick = (contact) => {
    setModalType('edit');
    setCurrentContact(contact);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (contact) => {
    setContactToDelete(contact);
    setIsDeleteModalOpen(true);
  };

  const handleSaveContact = () => {
    if (modalType === 'add') {
      setContacts([...contacts, { ...currentContact, id: Date.now() }]);
    } else {
      setContacts(contacts.map(c => c.id === currentContact.id ? currentContact : c));
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    setContacts(contacts.filter(c => c.id !== contactToDelete.id));
    setIsDeleteModalOpen(false);
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  return (
    <div>
      <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#1f2937', fontWeight: '600' }}>All Contacts</h3>
          <div style={{ display: 'flex', gap: '16px' }}>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: '#f9fafb', fontSize: '14px', width: '250px', outline: 'none' }}
            />
            <button 
              onClick={handleAddClick}
              style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>+</span> Add Contact
            </button>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', color: '#6b7280', fontSize: '11px', fontWeight: '600', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>NAME</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>EMAIL</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>PHONE</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>COMPANY</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>DESIGNATION</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact) => (
              <tr key={contact.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px 24px', color: '#1f2937', fontSize: '14px', fontWeight: '600' }}>{contact.name}</td>
                <td style={{ padding: '16px 24px', color: '#6b7280', fontSize: '14px' }}>{contact.email}</td>
                <td style={{ padding: '16px 24px', color: '#6b7280', fontSize: '14px' }}>{contact.phone}</td>
                <td style={{ padding: '16px 24px', color: '#6b7280', fontSize: '14px' }}>{contact.company}</td>
                <td style={{ padding: '16px 24px', color: '#6b7280', fontSize: '14px' }}>{contact.designation}</td>
                <td style={{ padding: '16px 24px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button onClick={() => handleEditClick(contact)} style={{ backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>Edit</button>
                  <button onClick={() => handleDeleteClick(contact)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ height: '32px' }}></div>
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', width: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                {modalType === 'add' ? 'Add Contact' : 'Edit Contact'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Name</label>
                <input 
                  type="text" 
                  value={currentContact.name} 
                  onChange={(e) => setCurrentContact({...currentContact, name: e.target.value})}
                  placeholder="Rahul Kumar"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Email</label>
                <input 
                  type="email" 
                  value={currentContact.email} 
                  onChange={(e) => setCurrentContact({...currentContact, email: e.target.value})}
                  placeholder="rahul@tech.com"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Phone</label>
                <input 
                  type="text" 
                  value={currentContact.phone} 
                  onChange={(e) => setCurrentContact({...currentContact, phone: e.target.value})}
                  placeholder="9876543210"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Company</label>
                <input 
                  type="text" 
                  value={currentContact.company} 
                  onChange={(e) => setCurrentContact({...currentContact, company: e.target.value})}
                  placeholder="Tech Solutions Pvt Ltd"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Designation</label>
                <input 
                  type="text" 
                  value={currentContact.designation} 
                  onChange={(e) => setCurrentContact({...currentContact, designation: e.target.value})}
                  placeholder="CTO"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#374151' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveContact}
                style={{ padding: '8px 16px', backgroundColor: '#3b82f6', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: 'white' }}
              >
                {modalType === 'add' ? 'Save' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ padding: '32px 24px 24px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <span style={{ color: '#d97706', fontSize: '24px' }}>⚠️</span>
              </div>
              <h2 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: '600', color: '#111827' }}>Delete Contact</h2>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                Are you sure you want to delete ? This action cannot be undone.
              </p>
            </div>
            <div style={{ padding: '16px 24px 24px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                style={{ padding: '8px 24px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#374151' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                style={{ padding: '8px 24px', backgroundColor: '#ef4444', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: 'white' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DealsManagement = ({ deals, setDeals, contacts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentDeal, setCurrentDeal] = useState({ title: '', contact: '', value: '', stage: 'Proposal', closeDate: '' });
  const [dealToDelete, setDealToDelete] = useState(null);

  const filteredDeals = deals.filter(deal => {
    const query = searchQuery.toLowerCase();
    return (
      deal.title.toLowerCase().includes(query) ||
      deal.contact.toLowerCase().includes(query) ||
      deal.stage.toLowerCase().includes(query)
    );
  });

  const getStageStyle = (stage) => {
    switch (stage) {
      case 'Won': return { backgroundColor: '#dcfce7', color: '#22c55e' };
      case 'Negotiation': return { backgroundColor: '#ffedd5', color: '#f97316' };
      case 'Proposal': return { backgroundColor: '#dbeafe', color: '#3b82f6' };
      default: return { backgroundColor: '#f3f4f6', color: '#6b7280' };
    }
  };

  const handleAddClick = () => {
    setModalType('add');
    setCurrentDeal({ title: '', contact: '', value: '', stage: 'Proposal', closeDate: '' });
    setIsModalOpen(true);
  };

  const handleEditClick = (deal) => {
    setModalType('edit');
    setCurrentDeal(deal);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (deal) => {
    setDealToDelete(deal);
    setIsDeleteModalOpen(true);
  };

  const handleSaveDeal = () => {
    if (modalType === 'add') {
      setDeals([...deals, { ...currentDeal, id: Date.now() }]);
    } else {
      setDeals(deals.map(d => d.id === currentDeal.id ? currentDeal : d));
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    setDeals(deals.filter(d => d.id !== dealToDelete.id));
    setIsDeleteModalOpen(false);
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  return (
    <div>
      <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#1f2937', fontWeight: '600' }}>All Deals</h3>
          <div style={{ display: 'flex', gap: '16px' }}>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: '#f9fafb', fontSize: '14px', width: '250px', outline: 'none' }}
            />
            <button 
              onClick={handleAddClick}
              style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>+</span> Add Deals
            </button>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', color: '#6b7280', fontSize: '11px', fontWeight: '600', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>TITLE</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>CONTACT</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>VALUE</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>STAGE</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>CLOSE DATE</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeals.map((deal) => (
              <tr key={deal.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px 24px', color: '#1f2937', fontSize: '14px', fontWeight: '600' }}>{deal.title}</td>
                <td style={{ padding: '16px 24px', color: '#6b7280', fontSize: '14px' }}>{deal.contact}</td>
                <td style={{ padding: '16px 24px', color: '#1f2937', fontSize: '14px', fontWeight: '600' }}>₹{deal.value}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    ...getStageStyle(deal.stage),
                    padding: '4px 12px', 
                    borderRadius: '9999px', 
                    fontSize: '12px', 
                    fontWeight: '500' 
                  }}>
                    {deal.stage}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', color: '#6b7280', fontSize: '14px' }}>{deal.closeDate}</td>
                <td style={{ padding: '16px 24px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button onClick={() => handleEditClick(deal)} style={{ backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>Edit</button>
                  <button onClick={() => handleDeleteClick(deal)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ height: '32px' }}></div>
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', width: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                {modalType === 'add' ? 'Add Deal' : 'Edit Deal'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Title</label>
                <input 
                  type="text" 
                  value={currentDeal.title} 
                  onChange={(e) => setCurrentDeal({...currentDeal, title: e.target.value})}
                  placeholder="Deal Title"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Contact</label>
                <select 
                  value={currentDeal.contact} 
                  onChange={(e) => setCurrentDeal({...currentDeal, contact: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}
                >
                  <option value="">-- Select Contact --</option>
                  {contacts.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Value (₹)</label>
                <input 
                  type="text" 
                  value={currentDeal.value} 
                  onChange={(e) => setCurrentDeal({...currentDeal, value: e.target.value})}
                  placeholder="e.g. 100000"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Stage</label>
                <select 
                  value={currentDeal.stage} 
                  onChange={(e) => setCurrentDeal({...currentDeal, stage: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}
                >
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Expected Close Date</label>
                <input 
                  type="date" 
                  value={currentDeal.closeDate} 
                  onChange={(e) => setCurrentDeal({...currentDeal, closeDate: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#374151' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveDeal}
                style={{ padding: '8px 16px', backgroundColor: '#3b82f6', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: 'white' }}
              >
                {modalType === 'add' ? 'Save' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ padding: '32px 24px 24px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <span style={{ color: '#d97706', fontSize: '24px' }}>⚠️</span>
              </div>
              <h2 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: '600', color: '#111827' }}>Delete deals</h2>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                Are you sure you want to delete ? This action cannot be undone.
              </p>
            </div>
            <div style={{ padding: '16px 24px 24px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                style={{ padding: '8px 24px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#374151' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                style={{ padding: '8px 24px', backgroundColor: '#ef4444', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: 'white' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TaskManagement = ({ tasks, setTasks, users }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentTask, setCurrentTask] = useState({ title: '', assignedTo: '', dueDate: '', priority: 'Medium', status: 'Pending' });
  const [taskToDelete, setTaskToDelete] = useState(null);

  const filteredTasks = tasks.filter(task => {
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.assignedTo.toLowerCase().includes(query) ||
      task.priority.toLowerCase().includes(query) ||
      task.status.toLowerCase().includes(query)
    );
  });

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High': return { backgroundColor: '#fee2e2', color: '#ef4444' };
      case 'Medium': return { backgroundColor: '#ffedd5', color: '#f97316' };
      case 'Low': return { backgroundColor: '#dcfce7', color: '#22c55e' };
      default: return { backgroundColor: '#f3f4f6', color: '#6b7280' };
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return { backgroundColor: '#ffedd5', color: '#f97316' };
      case 'In Progress': return { backgroundColor: '#dbeafe', color: '#3b82f6' };
      case 'Done': return { backgroundColor: '#dcfce7', color: '#22c55e' };
      default: return { backgroundColor: '#f3f4f6', color: '#6b7280' };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const date = new Date(dateStr);
    return isNaN(date) ? dateStr : date.toLocaleDateString('en-GB', options);
  };

  const handleAddClick = () => {
    setModalType('add');
    setCurrentTask({ title: '', assignedTo: '', dueDate: '', priority: 'Medium', status: 'Pending' });
    setIsModalOpen(true);
  };

  const handleEditClick = (task) => {
    setModalType('edit');
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleSaveTask = () => {
    if (modalType === 'add') {
      setTasks([...tasks, { ...currentTask, id: Date.now() }]);
    } else {
      setTasks(tasks.map(t => t.id === currentTask.id ? currentTask : t));
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    setTasks(tasks.filter(t => t.id !== taskToDelete.id));
    setIsDeleteModalOpen(false);
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  return (
    <div>
      <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#1f2937', fontWeight: '600' }}>All Tasks</h3>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={handleAddClick}
              style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>+</span> Add Tasks
            </button>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', color: '#6b7280', fontSize: '11px', fontWeight: '600', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>TITLE</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>ASSIGNED TO</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>DUE DATE</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>PRIORITY</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>STATUS</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px 24px', color: '#1f2937', fontSize: '14px', fontWeight: '600' }}>{task.title}</td>
                <td style={{ padding: '16px 24px', color: '#6b7280', fontSize: '14px' }}>{task.assignedTo}</td>
                <td style={{ padding: '16px 24px', color: '#6b7280', fontSize: '14px' }}>{formatDate(task.dueDate)}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    ...getPriorityStyle(task.priority),
                    padding: '4px 12px', 
                    borderRadius: '9999px', 
                    fontSize: '12px', 
                    fontWeight: '500' 
                  }}>
                    {task.priority}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    ...getStatusStyle(task.status),
                    padding: '4px 12px', 
                    borderRadius: '9999px', 
                    fontSize: '12px', 
                    fontWeight: '500' 
                  }}>
                    {task.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button onClick={() => handleEditClick(task)} style={{ backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>Edit</button>
                  <button onClick={() => handleDeleteClick(task)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ height: '32px' }}></div>
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', width: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                {modalType === 'add' ? 'Add Task' : 'Edit Task'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Title</label>
                <input 
                  type="text" 
                  value={currentTask.title} 
                  onChange={(e) => setCurrentTask({...currentTask, title: e.target.value})}
                  placeholder="Task Title"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Assign To</label>
                <select 
                  value={currentTask.assignedTo} 
                  onChange={(e) => setCurrentTask({...currentTask, assignedTo: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}
                >
                  <option value="">-- Select User --</option>
                  <option value="Sam Sales">Sam Sales</option>
                  <option value="Jake Johnson">Jake Johnson</option>
                  <option value="Priya Patel">Priya Patel</option>
                  <option value="Balaji">Balaji</option>
                  {users && users.filter(u => u.name && !["Sam Sales", "Jake Johnson", "Priya Patel", "Balaji"].includes(u.name)).map(u => (
                    <option key={u.id} value={u.name}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Due Date</label>
                <input 
                  type="date" 
                  value={currentTask.dueDate} 
                  onChange={(e) => setCurrentTask({...currentTask, dueDate: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Priority</label>
                <select 
                  value={currentTask.priority} 
                  onChange={(e) => setCurrentTask({...currentTask, priority: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Status</label>
                <select 
                  value={currentTask.status} 
                  onChange={(e) => setCurrentTask({...currentTask, status: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#374151' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveTask}
                style={{ padding: '8px 16px', backgroundColor: '#3b82f6', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: 'white' }}
              >
                {modalType === 'add' ? 'Save' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ padding: '32px 24px 24px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <span style={{ color: '#d97706', fontSize: '24px' }}>⚠️</span>
              </div>
              <h2 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: '600', color: '#111827' }}>Delete tasks</h2>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                Are you sure you want to delete ? This action cannot be undone.
              </p>
            </div>
            <div style={{ padding: '16px 24px 24px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                style={{ padding: '8px 24px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#374151' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                style={{ padding: '8px 24px', backgroundColor: '#ef4444', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: 'white' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReportAnalysis = ({ leads, deals }) => {
  const salespersons = [...new Set(leads.map(lead => lead.assignedTo))].filter(Boolean);

  const parseValue = (valStr) => {
    if (!valStr) return 0;
    const cleanStr = valStr.toString().replace(/,/g, '');
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
  };

  const formatCurrency = (num) => {
    return '₹' + num.toLocaleString('en-IN');
  };

  const getSalespersonForDeal = (deal) => {
    const lead = leads.find(l => l.name === deal.contact);
    return lead ? lead.assignedTo : 'Unassigned';
  };

  const salesReport = salespersons.map(sp => {
    const spDeals = deals.filter(d => getSalespersonForDeal(d) === sp);
    const wonDeals = spDeals.filter(d => d.stage === 'Won');
    const revenue = wonDeals.reduce((sum, d) => sum + parseValue(d.value), 0);
    return {
      salesperson: sp,
      dealsWon: wonDeals.length,
      revenue: formatCurrency(revenue)
    };
  });

  const teamPerformance = salespersons.map(sp => {
    const totalLeads = leads.filter(l => l.assignedTo === sp).length;
    const spDeals = deals.filter(d => getSalespersonForDeal(d) === sp);
    const openDeals = spDeals.filter(d => d.stage !== 'Won' && d.stage !== 'Lost').length;
    const dealsWon = spDeals.filter(d => d.stage === 'Won').length;
    
    return {
      salesperson: sp,
      totalLeads,
      openDeals,
      dealsWon
    };
  });

  return (
    <div>
      <div style={{ paddingBottom: '24px' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#1f2937', fontWeight: '600' }}>Sales Report — Deals Won by Salesperson</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#ffffff', color: '#9ca3af', fontSize: '11px', fontWeight: '600', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', borderTop: '1px solid #e5e7eb' }}>SALESPERSON</th>
                <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', borderTop: '1px solid #e5e7eb' }}>DEALS WON</th>
                <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', borderTop: '1px solid #e5e7eb' }}>REVENUE</th>
              </tr>
            </thead>
            <tbody>
              {salesReport.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px 24px', color: '#1f2937', fontSize: '14px', fontWeight: '600' }}>{row.salesperson}</td>
                  <td style={{ padding: '16px 24px', color: '#4b5563', fontSize: '14px' }}>{row.dealsWon}</td>
                  <td style={{ padding: '16px 24px', color: '#4b5563', fontSize: '14px' }}>{row.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ height: '8px' }}></div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#1f2937', fontWeight: '600' }}>Team Performance</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#ffffff', color: '#9ca3af', fontSize: '11px', fontWeight: '600', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', borderTop: '1px solid #e5e7eb' }}>SALESPERSON</th>
                <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', borderTop: '1px solid #e5e7eb' }}>TOTAL LEADS</th>
                <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', borderTop: '1px solid #e5e7eb' }}>OPEN DEALS</th>
                <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', borderTop: '1px solid #e5e7eb' }}>DEALS WON</th>
              </tr>
            </thead>
            <tbody>
              {teamPerformance.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px 24px', color: '#1f2937', fontSize: '14px', fontWeight: '600' }}>{row.salesperson}</td>
                  <td style={{ padding: '16px 24px', color: '#4b5563', fontSize: '14px' }}>{row.totalLeads}</td>
                  <td style={{ padding: '16px 24px', color: '#4b5563', fontSize: '14px' }}>{row.openDeals}</td>
                  <td style={{ padding: '16px 24px', color: row.dealsWon > 0 ? '#3b82f6' : '#4b5563', fontSize: '14px' }}>{row.dealsWon}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ height: '8px' }}></div>
        </div>
      </div>
    </div>
  );
};

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

  const [leads, setLeads] = useState([
    { id: 1, name: 'Rahul Kumar', email: 'rahul@tech.com', phone: '9876543210', source: 'Website', status: 'New', assignedTo: 'Sam Sales' },
    { id: 2, name: 'Sophia Lee', email: 'sophia@startup.io', phone: '9123456789', source: 'Referral', status: 'Contacted', assignedTo: 'Sam Sales' },
    { id: 3, name: 'Mark Evans', email: 'mark@bigcorp.com', phone: '9988776655', source: 'Cold Call', status: 'Interested', assignedTo: 'Jake Johnson' },
    { id: 4, name: 'Nisha Reddy', email: 'nisha@enterprise.in', phone: '8877665544', source: 'Social Media', status: 'Qualified', assignedTo: 'Priya Patel' },
    { id: 5, name: 'Tom Wright', email: 'tom@solutions.net', phone: '7766554433', source: 'Website', status: 'Not Interested', assignedTo: 'Jake Johnson' }
  ]);

  const [contacts, setContacts] = useState([
    { id: 1, name: 'Rahul Kumar', email: 'rahul@tech.com', phone: '9876543210', company: 'Tech Solutions Pvt Ltd', designation: 'CTO' },
    { id: 2, name: 'Sophia Lee', email: 'sophia@startup.io', phone: '9123456789', company: 'StartupIO', designation: 'CEO' },
    { id: 3, name: 'Nisha Reddy', email: 'nisha@enterprise.in', phone: '8877665544', company: 'Enterprise India', designation: 'Procurement Head' }
  ]);

  const [deals, setDeals] = useState([
    { id: 1, title: 'Tech Solutions ERP Deal', contact: 'Rahul Kumar', value: '1,50,000', stage: 'Won', closeDate: '2025-05-30' },
    { id: 2, title: 'StartupIO SaaS Package', contact: 'Amit Singh', value: '80,000', stage: 'Negotiation', closeDate: '2025-07-15' },
    { id: 3, title: 'Enterprise India Contract', contact: 'Nisha Reddy', value: '2,20,000', stage: 'Proposal', closeDate: '2025-08-01' }
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Follow up with Rahul', assignedTo: 'Sam Sales', dueDate: '2025-06-20', priority: 'High', status: 'Pending' },
    { id: 2, title: 'Send proposal to Sophia', assignedTo: 'Sam Sales', dueDate: '2025-06-18', priority: 'Medium', status: 'In Progress' },
    { id: 3, title: 'Demo call with Mark', assignedTo: 'Jake Johnson', dueDate: '2025-06-22', priority: 'High', status: 'Pending' },
    { id: 4, title: 'Contract review Nisha', assignedTo: 'Priya Patel', dueDate: '2025-06-25', priority: 'Low', status: 'Done' },
    { id: 5, title: 'send proposal to rahul', assignedTo: 'Balaji', dueDate: '2026-06-22', priority: 'Medium', status: 'Pending' }
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
            <Route path="/" element={<DashboardOverview users={users} leads={leads} deals={deals} />} />
            <Route path="/users" element={<UserManagement users={users} setUsers={setUsers} />} />
            <Route path="/roles" element={<RolesPermissions />} />
            <Route path="/leads" element={<LeadsManagement leads={leads} setLeads={setLeads} />} />
            <Route path="/contacts" element={<ContactManagement contacts={contacts} setContacts={setContacts} />} />
            <Route path="/deals" element={<DealsManagement deals={deals} setDeals={setDeals} contacts={contacts} />} />
            <Route path="/tasks" element={<TaskManagement tasks={tasks} setTasks={setTasks} users={users} />} />
            <Route path="/reports" element={<ReportAnalysis leads={leads} deals={deals} />} />
            <Route path="/settings" element={<AppSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
