import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const StatusBadge = ({ status }) => {
  let bgColor = '#f3f4f6';
  let textColor = '#374151';

  switch (status?.toLowerCase()) {
    case 'new':
      bgColor = '#dbeafe';
      textColor = '#1e40af';
      break;
    case 'contacted':
      bgColor = '#f3e8ff';
      textColor = '#7e22ce';
      break;
    case 'interested':
    case 'won':
      bgColor = '#dcfce7';
      textColor = '#166534';
      break;
    case 'not interested':
      bgColor = '#fee2e2';
      textColor = '#b91c1c';
      break;
    case 'negotiation':
      bgColor = '#ffedd5';
      textColor = '#c2410c';
      break;
    default:
      break;
  }

  // Format text (e.g. "not interested" -> "Not Interested")
  const formattedStatus = status ? status.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : 'Unknown';

  return (
    <span className="sales-status-badge" style={{ backgroundColor: bgColor, color: textColor, padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: '500' }}>
      {formattedStatus}
    </span>
  );
};

const EditLeadModal = ({ lead, onClose, onSave }) => {
  const [currentLead, setCurrentLead] = useState(lead);

  const handleSave = () => {
    onSave(currentLead);
  };

  if (!lead) return null;

  return (
    <div className="sales-modal-overlay">
      <div className="sales-modal-container sales-assign-modal" style={{ maxWidth: '500px' }}>
        <div className="sales-modal-header">
          <h2>Edit Lead Status</h2>
          <button onClick={onClose} className="sales-modal-close">
            <X size={20} />
          </button>
        </div>

        <div className="sales-modal-content">
          <p className="sales-assign-lead-text">
            Lead: <strong>{lead.name}</strong>
          </p>

          <div className="sales-form-group">
            <label className="sales-form-label">Status</label>
            <select 
              className="sales-form-select"
              value={currentLead.status}
              onChange={(e) => setCurrentLead({...currentLead, status: e.target.value})}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Interested">Interested</option>
              <option value="Qualified">Qualified</option>
              <option value="Not Interested">Not Interested</option>
            </select>
          </div>
          

        </div>

        <div className="sales-modal-footer">
          <button onClick={onClose} className="sales-btn-close" style={{ border: '1px solid #cbd5e1', backgroundColor: 'white' }}>Cancel</button>
          <button onClick={handleSave} className="sales-btn-primary" style={{ backgroundColor: '#3b82f6' }}>Update</button>
        </div>
      </div>
    </div>
  );
};

const ConvertContactModal = ({ lead, onClose, onSave }) => {
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');

  if (!lead) return null;

  return (
    <div className="sales-modal-overlay">
      <div className="sales-modal-container sales-assign-modal" style={{ maxWidth: '500px' }}>
        <div className="sales-modal-header">
          <h2>Convert to Contact</h2>
          <button onClick={onClose} className="sales-modal-close">
            <X size={20} />
          </button>
        </div>

        <div className="sales-modal-content">
          <p className="sales-assign-lead-text">
            Converting: <strong>{lead.name}</strong>
          </p>

          <div className="sales-form-group">
            <label className="sales-form-label">Company</label>
            <input 
              type="text"
              className="sales-form-input"
              placeholder="Company Name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          
          <div className="sales-form-group">
            <label className="sales-form-label">Designation</label>
            <input 
              type="text"
              className="sales-form-input"
              placeholder="Role / Title"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
          </div>
        </div>

        <div className="sales-modal-footer">
          <button onClick={onClose} className="sales-btn-close" style={{ border: '1px solid #cbd5e1', backgroundColor: 'white' }}>Cancel</button>
          <button onClick={() => onSave(lead, company, designation)} className="sales-btn-primary" style={{ backgroundColor: '#22c55e' }}>Convert to Contact</button>
        </div>
      </div>
    </div>
  );
};

const SalesLeads = () => {
  const [leads, setLeads] = useState([]);
  const [leadToEdit, setLeadToEdit] = useState(null);
  const [leadToConvert, setLeadToConvert] = useState(null);

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const fetchLeads = async () => {
    try {
      const [usersRes, leadsRes] = await Promise.all([
        fetch('/api/users', { headers }),
        fetch('/api/leads', { headers })
      ]);

      if (usersRes.ok && leadsRes.ok) {
        const users = await usersRes.json();
        const leadsData = await leadsRes.json();
        
        const loggedInUserStr = localStorage.getItem('user');
        const loggedInUserSession = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;
        
        const salesUser = users.find(u => u.email === loggedInUserSession?.email);
        const salesName = salesUser?.name || loggedInUserSession?.name;

        const myLeads = leadsData.filter(l => l.assignedSalesperson === salesName);
        setLeads(myLeads);
      }
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleEditSubmit = async (updatedLead) => {
    try {
      const res = await fetch(`/api/leads/${updatedLead.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedLead)
      });
      if (res.ok) {
        const savedLead = await res.json();
        setLeads(leads.map(l => l.id === savedLead.id ? savedLead : l));
        setLeadToEdit(null);
      }
    } catch (err) {
      console.error("Error updating lead", err);
    }
  };

  const handleConvertSubmit = async (lead, company, designation) => {
    try {
      const contactRes = await fetch('/api/contacts', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          company: company,
          designation: designation
        })
      });
      
      if (contactRes.ok) {
        const updatedLead = { ...lead, status: 'Qualified' };
        await fetch(`/api/leads/${lead.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(updatedLead)
        });
        
        setLeads(leads.map(l => l.id === lead.id ? updatedLead : l));
        setLeadToConvert(null);
      }
    } catch (err) {
      console.error("Error converting lead", err);
    }
  };

  return (
    <div className="sales-page-container">
      <div className="sales-card">
        <h2 className="sales-card-title">My Leads</h2>
        <div className="sales-table-wrapper">
          <table className="sales-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td style={{ fontWeight: '600', color: '#111827' }}>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone}</td>
                  <td><StatusBadge status={lead.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="sales-action-btn"
                        onClick={() => setLeadToEdit(lead)}
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        Update Status
                      </button>
                      <button 
                        className="sales-action-btn"
                        onClick={() => setLeadToConvert(lead)}
                        style={{ backgroundColor: '#22c55e', color: 'white', padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        Convert
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No leads assigned to you yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {leadToEdit && (
        <EditLeadModal 
          lead={leadToEdit} 
          onClose={() => setLeadToEdit(null)} 
          onSave={handleEditSubmit}
        />
      )}

      {leadToConvert && (
        <ConvertContactModal
          lead={leadToConvert}
          onClose={() => setLeadToConvert(null)}
          onSave={handleConvertSubmit}
        />
      )}
    </div>
  );
};

export default SalesLeads;
