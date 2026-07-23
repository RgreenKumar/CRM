import { useState } from 'react';

const UserManagement = ({ users, setUsers, leads, setLeads, tasks, setTasks }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalState, setModalState] = useState({ type: null, user: null }); // type can be 'add', 'edit', 'delete'

  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Sales User', status: 'Active', manager: '' });

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
    
    // Default fallback to Manager or whatever if it's something else like Support/Marketing
    return 'Sales Person';
  };

  const getRoleStyle = (role) => {
    if (role === 'Admin') return { backgroundColor: '#fef2f2', color: '#991b1b', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', display: 'inline-block' };
    if (role === 'Manager') return { backgroundColor: '#eff6ff', color: '#1e40af', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', display: 'inline-block' };
    return { backgroundColor: '#ecfdf5', color: '#065f46', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', display: 'inline-block' };
  };

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
            <th>Manager</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td><div className="lead-name">{user.name}</div></td>
              <td><div className="lead-email">{user.email}</div></td>
              <td>
                <span style={getRoleStyle(formatRole(user.role))}>
                  {formatRole(user.role)}
                </span>
              </td>
              <td style={{ fontWeight: '500', color: user.manager ? '#374151' : '#9ca3af' }}>
                {user.manager ? `👤 ${user.manager}` : '-'}
              </td>
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
                <option value="Manager">Manager</option>
                <option value="Sales Person">Sales Person</option>
              </select>
            </div>
            {formData.role === 'Sales Person' && (
              <div className="form-group">
                <label className="form-label">select Manager</label>
                <select className="form-select" value={formData.manager} onChange={e => setFormData({ ...formData, manager: e.target.value })}>
                  <option value="">Select a Manager</option>
                  {users.filter(u => (u.role || '').toUpperCase().includes('MANAGER')).map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>
            )}
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

export default UserManagement;
