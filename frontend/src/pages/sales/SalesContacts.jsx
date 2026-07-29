import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, Building, AlertTriangle } from 'lucide-react';

const DeleteModal = ({ onClose, onConfirm, itemName }) => {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 1000
    }}>
      <div style={{ maxWidth: '400px', width: '100%', backgroundColor: 'white', padding: '24px', borderRadius: '8px', position: 'relative', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.25rem', color: '#111827' }}>Delete Contact</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'absolute', top: '16px', right: '16px' }}>
            <X size={20} color="#9ca3af" />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0 2rem 0' }}>
          <AlertTriangle size={48} color="#ef4444" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '1.05rem', fontWeight: '500', margin: 0, color: '#1f2937' }}>
            Want to Delete {itemName}?
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
    <span className="sales-status-badge" style={{ backgroundColor: bgColor, color: textColor, padding: '2px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
      {status || 'Unknown'}
    </span>
  );
};

const ViewContactModal = ({ contact, deals, onClose }) => {
  if (!contact) return null;
  const linkedDeals = deals.filter(d => d.contact === contact.name);

  return (
    <div className="sales-modal-overlay">
      <div className="sales-modal-container sales-assign-modal" style={{ maxWidth: '600px' }}>
        <div className="sales-modal-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Contact — {contact.name}</h2>
          <button onClick={onClose} className="sales-modal-close">
            <X size={20} />
          </button>
        </div>
        <div className="sales-modal-content" style={{ paddingBottom: '0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569' }}>
              <Mail size={16} color="#94a3b8" />
              <span>{contact.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569' }}>
              <Phone size={16} color="#ef4444" />
              <span>{contact.phone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569' }}>
              <Building size={16} color="#64748b" />
              <span>{contact.company || 'Unknown Company'} — {contact.designation || 'Role not specified'}</span>
            </div>
          </div>
          
          <h3 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1e293b' }}>Linked Deals</h3>
          <div className="sales-table-wrapper" style={{ boxShadow: 'none', border: '1px solid #f1f5f9', borderRadius: '8px' }}>
            <table className="sales-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ backgroundColor: '#f8fafc' }}>TITLE</th>
                  <th style={{ backgroundColor: '#f8fafc' }}>STAGE</th>
                  <th style={{ backgroundColor: '#f8fafc' }}>VALUE</th>
                </tr>
              </thead>
              <tbody>
                {linkedDeals.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontSize: '0.85rem' }}>{d.title}</td>
                    <td><StatusBadge status={d.stage} /></td>
                    <td style={{ fontSize: '0.85rem', fontWeight: '500' }}>₹{d.value}</td>
                  </tr>
                ))}
                {linkedDeals.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>No linked deals.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="sales-modal-footer">
          <button onClick={onClose} className="sales-btn-close" style={{ backgroundColor: '#f1f5f9', border: 'none', color: '#334155', fontWeight: '600' }}>Close</button>
        </div>
      </div>
    </div>
  );
};

const AddDealModal = ({ contact, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    contact: contact ? contact.name : '',
    value: '',
    stage: 'Proposal',
    closeDate: ''
  });

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="sales-modal-overlay">
      <div className="sales-modal-container sales-assign-modal" style={{ maxWidth: '500px' }}>
        <div className="sales-modal-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Add Deal</h2>
          <button onClick={onClose} className="sales-modal-close">
            <X size={20} />
          </button>
        </div>
        <div className="sales-modal-content">
          <div className="sales-form-group">
            <label className="sales-form-label">Title</label>
            <input name="title" type="text" className="sales-form-input" placeholder="Deal Title" value={formData.title} onChange={handleChange} />
          </div>
          <div className="sales-form-group">
            <label className="sales-form-label">Contact</label>
            <select name="contact" className="sales-form-select" value={formData.contact} onChange={handleChange}>
              {contact && <option value={contact.name}>{contact.name}</option>}
            </select>
          </div>
          <div className="sales-form-group">
            <label className="sales-form-label">Value (₹)</label>
            <input name="value" type="number" className="sales-form-input" placeholder="e.g. 100000" value={formData.value} onChange={handleChange} />
          </div>
          <div className="sales-form-group">
            <label className="sales-form-label">Stage</label>
            <select name="stage" className="sales-form-select" value={formData.stage} onChange={handleChange}>
              <option value="Discovery">Discovery</option>
              <option value="Qualification">Qualification</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
          <div className="sales-form-group">
            <label className="sales-form-label">Expected Close Date</label>
            <input name="closeDate" type="date" className="sales-form-input" value={formData.closeDate} onChange={handleChange} />
          </div>
        </div>
        <div className="sales-modal-footer">
          <button onClick={onClose} className="sales-btn-close">Cancel</button>
          <button onClick={handleSubmit} className="sales-btn-primary" style={{ backgroundColor: '#2563eb' }}>Save</button>
        </div>
      </div>
    </div>
  );
};

const AddContactModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    designation: ''
  });

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="sales-modal-overlay">
      <div className="sales-modal-container sales-assign-modal" style={{ maxWidth: '500px' }}>
        <div className="sales-modal-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Add Contact</h2>
          <button onClick={onClose} className="sales-modal-close">
            <X size={20} />
          </button>
        </div>
        <div className="sales-modal-content">
          <div className="sales-form-group">
            <label className="sales-form-label">Name</label>
            <input name="name" type="text" className="sales-form-input" placeholder="Full Name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="sales-form-group">
            <label className="sales-form-label">Email</label>
            <input name="email" type="email" className="sales-form-input" placeholder="Email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="sales-form-group">
            <label className="sales-form-label">Phone</label>
            <input name="phone" type="text" className="sales-form-input" placeholder="Phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="sales-form-group">
            <label className="sales-form-label">Company</label>
            <input name="company" type="text" className="sales-form-input" placeholder="Company Name" value={formData.company} onChange={handleChange} />
          </div>
          <div className="sales-form-group">
            <label className="sales-form-label">Designation</label>
            <input name="designation" type="text" className="sales-form-input" placeholder="Designation" value={formData.designation} onChange={handleChange} />
          </div>
        </div>
        <div className="sales-modal-footer">
          <button onClick={onClose} className="sales-btn-close">Cancel</button>
          <button onClick={handleSubmit} className="sales-btn-primary" style={{ backgroundColor: '#2563eb' }}>Save</button>
        </div>
      </div>
    </div>
  );
};

const SalesContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  
  const [viewContact, setViewContact] = useState(null);
  const [dealContact, setDealContact] = useState(null);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const fetchData = async () => {
    try {
      const [contactsRes, dealsRes] = await Promise.all([
        fetch('/api/contacts', { headers }),
        fetch('/api/deals', { headers })
      ]);
      if (contactsRes.ok) setContacts(await contactsRes.json());
      if (dealsRes.ok) setDeals(await dealsRes.json());
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddContact = async (data) => {
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const created = await res.json();
        setContacts([...contacts, created]);
        setIsAddContactOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddDeal = async (data) => {
    try {
      const loggedInUserStr = localStorage.getItem('user');
      const loggedInUserSession = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;
      
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...data,
          status: 'Open',
          salesPerson: loggedInUserSession?.name || ''
        })
      });
      if (res.ok) {
        const created = await res.json();
        setDeals([...deals, created]);
        setDealContact(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteContactOpen = (contact) => {
    setContactToDelete(contact);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!contactToDelete) return;
    try {
      const res = await fetch(`/api/contacts/${contactToDelete.id}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        setContacts(contacts.filter(c => c.id !== contactToDelete.id));
      }
    } catch (err) {
      console.error(err);
    }
    setIsDeleteOpen(false);
    setContactToDelete(null);
  };

  return (
    <div className="sales-page-container">
      <div className="sales-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="sales-card-title" style={{ margin: 0 }}>My Contacts</h2>
          <button onClick={() => setIsAddContactOpen(true)} className="sales-btn-primary" style={{ backgroundColor: '#2563eb', padding: '0.5rem 1rem' }}>
            + Add Contact
          </button>
        </div>
        <div className="sales-table-wrapper">
          <table className="sales-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>COMPANY</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td style={{ fontWeight: '600', color: '#111827' }}>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.company || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button onClick={() => setViewContact(contact)} style={{ backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '0.3rem 0.6rem', fontSize: '0.7rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>
                        View
                      </button>
                      <button onClick={() => setDealContact(contact)} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '0.3rem 0.6rem', fontSize: '0.7rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>
                        + Deal
                      </button>
                      <button onClick={() => handleDeleteContactOpen(contact)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.3rem 0.6rem', fontSize: '0.7rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {contacts.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No contacts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewContact && (
        <ViewContactModal contact={viewContact} deals={deals} onClose={() => setViewContact(null)} />
      )}
      
      {dealContact && (
        <AddDealModal contact={dealContact} onClose={() => setDealContact(null)} onSave={handleAddDeal} />
      )}
      
      {isAddContactOpen && (
        <AddContactModal onClose={() => setIsAddContactOpen(false)} onSave={handleAddContact} />
      )}

      {isDeleteOpen && (
        <DeleteModal 
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleConfirmDelete}
          itemName={contactToDelete?.name}
        />
      )}
    </div>
  );
};

export default SalesContacts;
