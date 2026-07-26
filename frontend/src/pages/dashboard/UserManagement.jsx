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
      setFormData({ name: '', email: '', role: 'Sales User', status: 'Active', manager: '' });
    }
  };

  const closeModal = () => setModalState({ type: null, user: null });

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    const payload = { ...formData };
    if (payload.role === 'Admin') payload.role = 'ROLE_ADMIN';
    if (payload.role === 'Sales Manager') payload.role = 'ROLE_MANAGER';
    if (payload.role === 'Sales User') payload.role = 'ROLE_SALES';

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
    if (!roleStr) return 'Sales User';
    const normalized = roleStr.toUpperCase();
    if (normalized.includes('ADMIN')) return 'Admin';
    if (normalized.includes('MANAGER')) return 'Sales Manager';
    if (normalized.includes('SALES')) return 'Sales User';
    return 'Sales User';
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
      <div className="um-header-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: 'white', padding: '1.5rem', borderRadius: '8px', borderBottom: 'none' }}>
        <div className="um-title-section" style={{ border: 'none', padding: 0 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: 0 }}>Users</h2>
          <p style={{ color: '#6b7280', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>Manage user accounts and access</p>
        </div>
        <div className="um-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="um-search-wrapper" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.5rem 1rem', borderRadius: '6px' }}>
            <input
              type="text"
              className="um-search-input"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.875rem' }}
            />
          </div>
          <button className="um-btn-primary" onClick={() => openModal('add')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}>
            <Plus size={16} /> Add User
          </button>
        </div>
      </div>

      <div className="um-table-container" style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table className="um-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#64748b', fontSize: '0.875rem' }}>Name</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#64748b', fontSize: '0.875rem' }}>Email</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#64748b', fontSize: '0.875rem' }}>Role</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#64748b', fontSize: '0.875rem' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#64748b', fontSize: '0.875rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500, color: '#111827', fontSize: '0.875rem' }}>
                  {user.name}
                </td>
                <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                  {user.email}
                </td>
                <td style={{ padding: '1rem 1.5rem', color: '#475569', fontSize: '0.875rem' }}>
                  {formatRole(user.role)}
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ 
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.75rem', 
                    fontWeight: 500,
                    background: user.status === 'Active' ? '#22c55e' : '#94a3b8',
                    color: 'white'
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openModal('edit', user)} style={{ padding: '0.35rem 0.75rem', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', color: '#475569', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500 }}>
                      Edit
                    </button>
                    <button onClick={() => openModal('delete', user)} style={{ padding: '0.35rem 0.75rem', background: '#ef4444', border: 'none', borderRadius: '4px', color: 'white', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500 }}>
                      Delete
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
                <option value="Admin">Admin</option>
                <option value="Sales Manager">Sales Manager</option>
                <option value="Sales User">Sales User</option>
              </select>
            </div>
            {formData.role === 'Sales User' && (
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
