import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteModal = ({ onClose, onConfirm }) => {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 1000
    }}>
      <div style={{ maxWidth: '400px', width: '100%', backgroundColor: 'white', padding: '24px', borderRadius: '8px', position: 'relative', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.25rem', color: '#111827' }}>Delete Deal</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'absolute', top: '16px', right: '16px' }}>
            <X size={20} color="#9ca3af" />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0 2rem 0' }}>
          <AlertTriangle size={48} color="#ef4444" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '1.05rem', fontWeight: '500', margin: 0, color: '#1f2937' }}>
            Want to Delete the Deal?
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', border: 'none', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: '8px 16px', border: 'none', backgroundColor: '#ef4444', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  let bgColor = '#f3f4f6';
  let textColor = '#374151';

  switch (status?.toLowerCase()) {
    case 'discovery':
      bgColor = '#dbeafe';
      textColor = '#1e40af';
      break;
    case 'proposal':
      bgColor = '#fef08a';
      textColor = '#854d0e';
      break;
    case 'negotiation':
      bgColor = '#ffedd5';
      textColor = '#c2410c';
      break;
    case 'won':
      bgColor = '#dcfce7';
      textColor = '#166534';
      break;
    case 'lost':
      bgColor = '#fee2e2';
      textColor = '#b91c1c';
      break;
    default:
      break;
  }

  return (
    <span className="sales-status-badge" style={{ backgroundColor: bgColor, color: textColor, padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '500' }}>
      {status || 'Unknown'}
    </span>
  );
};

const SalesDeals = () => {
  const [deals, setDeals] = useState([]);
  const [leads, setLeads] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [salesName, setSalesName] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    contact: '',
    value: '',
    stage: 'Proposal',
    closeDate: ''
  });

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    try {
      const [usersRes, dealsRes, leadsRes] = await Promise.all([
        fetch('/api/users', { headers }),
        fetch('/api/deals', { headers }),
        fetch('/api/leads', { headers })
      ]);

      if (usersRes.ok && dealsRes.ok && leadsRes.ok) {
        const users = await usersRes.json();
        const dealsData = await dealsRes.json();
        const leadsData = await leadsRes.json();
        
        const loggedInUserStr = localStorage.getItem('user');
        const loggedInUserSession = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;
        
        const salesUser = users.find(u => u.email === loggedInUserSession?.email);
        const name = salesUser?.name || loggedInUserSession?.name;
        setSalesName(name);

        const myLeads = leadsData.filter(l => l.assignedSalesperson === name);
        setLeads(myLeads.length > 0 ? myLeads : leadsData); // fallback to all leads if none assigned for dropdown

        const enrichedDeals = dealsData.map(d => {
          const associatedLead = leadsData.find(l => l.name === d.contact);
          return {
            ...d,
            salesPerson: associatedLead && associatedLead.assignedSalesperson ? associatedLead.assignedSalesperson : (d.salesPerson || 'Unassigned')
          };
        });

        const myDeals = enrichedDeals.filter(d => d.salesPerson === name);
        setDeals(myDeals);
      }
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, salesPerson: salesName })
      });
      if (res.ok) {
        setIsAddOpen(false);
        setFormData({ title: '', contact: '', value: '', stage: 'Proposal', closeDate: '' });
        fetchData();
      }
    } catch (err) {
      console.error("Error adding deal", err);
    }
  };

  const handleEditOpen = (deal) => {
    setFormData({
      title: deal.title || '',
      contact: deal.contact || '',
      value: deal.value?.replace(/[^0-9]/g, '') || '', // strip currency if any
      stage: deal.stage || 'Proposal',
      closeDate: deal.closeDate || ''
    });
    setEditId(deal.id);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/deals/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, salesPerson: salesName })
      });
      if (res.ok) {
        setIsEditOpen(false);
        setEditId(null);
        setFormData({ title: '', contact: '', value: '', stage: 'Proposal', closeDate: '' });
        fetchData();
      }
    } catch (err) {
      console.error("Error updating deal", err);
    }
  };

  const handleDeleteOpen = (id) => {
    setDealToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!dealToDelete) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/deals/${dealToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Error deleting deal", err);
    }
    setIsDeleteOpen(false);
    setDealToDelete(null);
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const modalStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    position: 'relative'
  };

  const closeBtnStyle = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#6b7280'
  };

  const inputGroupStyle = {
    marginBottom: '16px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    boxSizing: 'border-box'
  };

  const btnContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px'
  };

  const btnCancelStyle = {
    padding: '8px 16px',
    border: 'none',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500'
  };

  const btnSubmitStyle = {
    padding: '8px 16px',
    border: 'none',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500'
  };

  return (
    <div className="sales-page-container">
      <div className="sales-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="sales-card-title" style={{ margin: 0 }}>My Deals</h2>
          <button 
            onClick={() => setIsAddOpen(true)}
            style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
          >
            + Add Deal
          </button>
        </div>
        
        <div className="sales-table-wrapper">
          <table className="sales-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb', textAlign: 'left', color: '#6b7280', fontSize: '0.875rem' }}>
                <th style={{ padding: '12px 16px' }}>TITLE</th>
                <th style={{ padding: '12px 16px' }}>CONTACT</th>
                <th style={{ padding: '12px 16px' }}>VALUE</th>
                <th style={{ padding: '12px 16px' }}>STAGE</th>
                <th style={{ padding: '12px 16px' }}>CLOSE DATE</th>
                <th style={{ padding: '12px 16px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <tr key={deal.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: '#111827' }}>{deal.title}</td>
                  <td style={{ padding: '12px 16px', color: '#4b5563' }}>{deal.contact}</td>
                  <td style={{ padding: '12px 16px', color: '#4b5563' }}>
                    {deal.value?.includes('₹') ? deal.value : `₹${deal.value}`}
                  </td>
                  <td style={{ padding: '12px 16px' }}><StatusBadge status={deal.stage} /></td>
                  <td style={{ padding: '12px 16px', color: '#4b5563' }}>{deal.closeDate || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button 
                      onClick={() => handleEditOpen(deal)}
                      style={{ marginRight: '8px', padding: '4px 8px', fontSize: '0.75rem', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Edit Stage
                    </button>
                    <button 
                      onClick={() => handleDeleteOpen(deal.id)}
                      style={{ padding: '4px 8px', fontSize: '0.75rem', backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {deals.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No deals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <button style={closeBtnStyle} onClick={() => setIsAddOpen(false)}>×</button>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.25rem', color: '#111827' }}>Add Deal</h3>
            <form onSubmit={handleAddSubmit}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Title</label>
                <input style={inputStyle} type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Deal Title" required />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Contact</label>
                <select style={inputStyle} name="contact" value={formData.contact} onChange={handleInputChange} required>
                  <option value="">-- Select Contact --</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.name}>{lead.name}</option>
                  ))}
                </select>
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Value (₹)</label>
                <input style={inputStyle} type="number" name="value" value={formData.value} onChange={handleInputChange} placeholder="e.g. 100000" required />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Stage</label>
                <select style={inputStyle} name="stage" value={formData.stage} onChange={handleInputChange} required>
                  <option value="Discovery">Discovery</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Expected Close Date</label>
                <input style={inputStyle} type="date" name="closeDate" value={formData.closeDate} onChange={handleInputChange} required />
              </div>
              <div style={btnContainerStyle}>
                <button type="button" style={btnCancelStyle} onClick={() => setIsAddOpen(false)}>Cancel</button>
                <button type="submit" style={btnSubmitStyle}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <button style={closeBtnStyle} onClick={() => setIsEditOpen(false)}>×</button>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.25rem', color: '#111827' }}>Edit Deal</h3>
            <form onSubmit={handleEditSubmit}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Title</label>
                <input style={inputStyle} type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Deal Title" required />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Contact</label>
                <select style={inputStyle} name="contact" value={formData.contact} onChange={handleInputChange} required>
                  <option value="">-- Select Contact --</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.name}>{lead.name}</option>
                  ))}
                </select>
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Value (₹)</label>
                <input style={inputStyle} type="number" name="value" value={formData.value} onChange={handleInputChange} placeholder="e.g. 100000" required />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Stage</label>
                <select style={inputStyle} name="stage" value={formData.stage} onChange={handleInputChange} required>
                  <option value="Discovery">Discovery</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Expected Close Date</label>
                <input style={inputStyle} type="date" name="closeDate" value={formData.closeDate} onChange={handleInputChange} required />
              </div>
              <div style={btnContainerStyle}>
                <button type="button" style={btnCancelStyle} onClick={() => setIsEditOpen(false)}>Cancel</button>
                <button type="submit" style={btnSubmitStyle}>Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <DeleteModal 
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default SalesDeals;
