import { useState } from 'react';

const LeadsManagement = ({ leads, setLeads, users }) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterAssignee, setFilterAssignee] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentLead, setCurrentLead] = useState({ name: '', email: '', phone: '', source: 'Website', status: 'New', assignedManager: '', assignedSalesperson: '' });
  const [leadToDelete, setLeadToDelete] = useState(null);

  const filteredLeads = leads.filter(lead => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      lead.name.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.phone.toLowerCase().includes(query) ||
      lead.source.toLowerCase().includes(query) ||
      lead.status.toLowerCase().includes(query) ||
      (lead.assignedManager || '').toLowerCase().includes(query) ||
      (lead.assignedSalesperson || '').toLowerCase().includes(query)
    );
    const matchesStatus = filterStatus === 'All' || lead.status === filterStatus;
    const matchesAssignee = filterAssignee === 'All' || 
      (filterAssignee === 'Unassigned' ? !lead.assignedManager || lead.assignedManager === 'Unassigned' : lead.assignedManager === filterAssignee || lead.assignedSalesperson === filterAssignee);
    
    return matchesSearch && matchesStatus && matchesAssignee;
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
    setCurrentLead({ name: '', email: '', phone: '', source: 'Website', status: 'New', assignedManager: '', assignedSalesperson: '' });
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

  const handleSaveLead = async () => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    if (modalType === 'add') {
      try {
        const res = await fetch('/api/leads', { method: 'POST', headers, body: JSON.stringify(currentLead) });
        if (res.ok) {
          const newLead = await res.json();
          setLeads([...leads, newLead]);
        }
      } catch (err) { console.error(err); }
    } else {
      try {
        const res = await fetch(`/api/leads/${currentLead.id}`, { method: 'PUT', headers, body: JSON.stringify(currentLead) });
        if (res.ok) {
          const updatedLead = await res.json();
          setLeads(leads.map(l => l.id === currentLead.id ? updatedLead : l));
        }
      } catch (err) { console.error(err); }
    }
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/leads/${leadToDelete.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        setLeads(leads.filter(l => l.id !== leadToDelete.id));
      }
    } catch (err) { console.error(err); }
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
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: '#f9fafb', fontSize: '14px', outline: 'none' }}
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Interested">Interested</option>
              <option value="Qualified">Qualified</option>
              <option value="Not Interested">Not Interested</option>
            </select>
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: '#f9fafb', fontSize: '14px', outline: 'none' }}
            >
              <option value="All">All Assignees</option>
              <option value="Unassigned">Unassigned</option>
              {users && users.filter(u => u.role !== 'Admin' && u.role !== 'ROLE_ADMIN').map(u => (
                <option key={u.id} value={u.name}>{u.name}</option>
              ))}
            </select>
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
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>MANAGER</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>SALES PERSON</th>
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
                <td style={{ padding: '16px 24px', color: '#6b7280', fontSize: '14px' }}>{lead.assignedManager || 'Unassigned'}</td>
                <td style={{ padding: '16px 24px', color: '#6b7280', fontSize: '14px' }}>
                  {lead.assignedSalesperson ? lead.assignedSalesperson : <span style={{ fontStyle: 'italic', color: '#9ca3af' }}>Pending Manager Review</span>}
                </td>
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
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Assign Manager</label>
                <select 
                  value={currentLead.assignedManager} 
                  onChange={(e) => setCurrentLead({...currentLead, assignedManager: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}
                >
                  <option value="">-- Select Manager --</option>
                  {users && users.filter(u => u.role !== 'Admin' && u.role !== 'ROLE_ADMIN' && u.role !== 'ROLE_SALES').map(u => (
                    <option key={u.id} value={u.name}>{u.name}</option>
                  ))}
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

export default LeadsManagement;
