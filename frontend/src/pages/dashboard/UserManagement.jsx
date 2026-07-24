import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Shield, UserCircle, Briefcase, Mail, CheckCircle2, XCircle, X, AlertTriangle } from 'lucide-react';
import './UserManagement.css';

const UserManagement = ({ users, setUsers, leads, setLeads, tasks, setTasks }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalState, setModalState] = useState({ type: null, user: null }); // type can be 'add', 'edit', 'delete'

  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Sales Person', status: 'Active', manager: '' });

  const openModal = (type, user = null) => {
    setModalState({ type, user });
    if (user) {
      setFormData({ name: user.name, email: user.email, role: formatRole(user.role), status: user.status, manager: user.manager || '' });
    } else {
      setFormData({ name: '', email: '', role: 'Sales Person', status: 'Active', manager: '' });
    }
  };

  const closeModal = () => setModalState({ type: null, user: null });

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    const payload = { ...formData };
    if (payload.role === 'Admin') payload.role = 'ROLE_ADMIN';
    if (payload.role === 'Manager') payload.role = 'ROLE_MANAGER';
    if (payload.role === 'Sales Person') payload.role = 'ROLE_SALES';

    if (modalState.type === 'add') {
      try {
        const res = await fetch('/api/users', { method: 'POST', headers, body: JSON.stringify(payload) });
        if (res.ok) {
          const newUser = await res.json();
          setUsers([...users, newUser]);
        }
      } catch (err) { console.error(err); }
    } else if (modalState.type === 'edit') {
      try {
        const oldName = modalState.user.name;
        const res = await fetch(`/api/users/${modalState.user.id}`, { method: 'PUT', headers, body: JSON.stringify(payload) });
        if (res.ok) {
          const updatedUser = await res.json();
          setUsers(users.map(u => u.id === modalState.user.id ? updatedUser : u));
          
          if (oldName !== updatedUser.name) {
             if (leads && setLeads) {
                 setLeads(leads.map(l => l.assignedTo === oldName ? { ...l, assignedTo: updatedUser.name } : l));
             }
             if (tasks && setTasks) {
                 setTasks(tasks.map(t => t.assignedTo === oldName ? { ...t, assignedTo: updatedUser.name } : t));
             }
          }
        }
      } catch (err) { console.error(err); }
    }
    closeModal();
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const oldName = modalState.user.name;
      const res = await fetch(`/api/users/${modalState.user.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== modalState.user.id));
        if (leads && setLeads) {
             setLeads(leads.map(l => l.assignedTo === oldName ? { ...l, assignedTo: 'Unassigned' } : l));
        }
        if (tasks && setTasks) {
             setTasks(tasks.map(t => t.assignedTo === oldName ? { ...t, assignedTo: 'Unassigned' } : t));
        }
      }
    } catch (err) { console.error(err); }
    closeModal();
  };

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    return (u.name || '').toLowerCase().includes(q) || 
           (u.email || '').toLowerCase().includes(q) || 
           (u.role || '').toLowerCase().includes(q) || 
           (u.status || '').toLowerCase().includes(q);
  });

  const formatRole = (roleStr) => {
    if (!roleStr) return '';
    const normalized = roleStr.toUpperCase();
    if (normalized.includes('ADMIN')) return 'Admin';
    if (normalized.includes('MANAGER')) return 'Manager';
    if (normalized.includes('SALES')) return 'Sales Person';
    return 'Sales Person';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getRoleBadge = (role) => {
    if (role === 'Admin') return <span className="um-badge um-badge-admin"><Shield size={14} /> Admin</span>;
    if (role === 'Manager') return <span className="um-badge um-badge-manager"><Briefcase size={14} /> Manager</span>;
    return <span className="um-badge um-badge-sales"><UserCircle size={14} /> Sales Person</span>;
  };

  return (
    <div className="um-container">
      <div className="um-header-card">
        <div className="um-title-section">
          <h2>Team Members</h2>
          <p>Manage access, roles, and collaborate efficiently.</p>
        </div>
        <div className="um-actions">
          <div className="um-search-wrapper">
            <Search className="um-search-icon" size={18} />
            <input
              type="text"
              className="um-search-input"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="um-btn-primary" onClick={() => openModal('add')}>
            <Plus size={18} /> Add User
          </button>
        </div>
      </div>

      <div className="um-table-container">
        <table className="um-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Manager</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="um-user-cell">
                    <div className="um-avatar">{getInitials(user.name)}</div>
                    <div className="um-user-info">
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </div>
                  </div>
                </td>
                <td>{getRoleBadge(formatRole(user.role))}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: user.manager ? '#475569' : '#cbd5e1' }}>
                    {user.manager ? <UserCircle size={16} /> : null}
                    <span style={{ fontWeight: '500' }}>{user.manager || '—'}</span>
                  </div>
                </td>
                <td>
                  <span className={`um-status ${user.status === 'Active' ? 'um-status-active' : 'um-status-inactive'}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="um-actions-cell">
                    <button className="um-action-btn" title="Edit User" onClick={() => openModal('edit', user)}>
                      <Edit2 size={18} />
                    </button>
                    <button className="um-action-btn delete" title="Delete User" onClick={() => openModal('delete', user)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
               <tr>
                 <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                   No users found matching "{searchQuery}"
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {(modalState.type === 'add' || modalState.type === 'edit') && (
        <div className="um-modal-overlay">
          <div className="um-modal-content">
            <div className="um-modal-header">
              <h3>{modalState.type === 'add' ? 'Create New User' : 'Edit User Profile'}</h3>
              <button className="um-close-btn" onClick={closeModal}><X size={20} /></button>
            </div>

            <div className="um-form-group">
              <label className="um-form-label">Full Name</label>
              <input type="text" className="um-form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Jane Doe" />
            </div>
            <div className="um-form-group">
              <label className="um-form-label">Email Address</label>
              <input type="email" className="um-form-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="jane@example.com" />
            </div>
            <div className="um-form-group">
              <label className="um-form-label">Role</label>
              <select className="um-form-select" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                <option value="Admin">Administrator</option>
                <option value="Manager">Manager</option>
                <option value="Sales Person">Sales Representative</option>
              </select>
            </div>
            {formData.role === 'Sales Person' && (
              <div className="um-form-group">
                <label className="um-form-label">Assign Manager</label>
                <select className="um-form-select" value={formData.manager} onChange={e => setFormData({ ...formData, manager: e.target.value })}>
                  <option value="">Select a Manager</option>
                  {users.filter(u => (u.role || '').toUpperCase().includes('MANAGER')).map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="um-form-group">
              <label className="um-form-label">Account Status</label>
              <select className="um-form-select" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="um-modal-footer">
              <button className="um-btn-outline" onClick={closeModal}>Cancel</button>
              <button className="um-btn-save" onClick={handleSave}>
                {modalState.type === 'add' ? 'Create User' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalState.type === 'delete' && (
        <div className="um-modal-overlay">
          <div className="um-modal-content" style={{ width: '400px' }}>
            <div className="um-modal-header" style={{ marginBottom: '1rem', borderBottom: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ef4444' }}>
                <AlertTriangle size={24} />
                <h3 style={{ color: '#ef4444' }}>Remove User</h3>
              </div>
            </div>
            <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Are you sure you want to delete <strong>{modalState.user?.name}</strong>? This action cannot be undone and will permanently remove their access.
            </p>
            <div className="um-modal-footer" style={{ marginTop: '0' }}>
              <button className="um-btn-outline" onClick={closeModal}>Cancel</button>
              <button className="um-btn-danger" onClick={handleDelete}>Delete User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
