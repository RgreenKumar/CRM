import React, { useState, useEffect } from 'react';
import { api } from '../../api';

const DealsManagement = () => {
  const [deals, setDeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentDeal, setCurrentDeal] = useState({ title: '', contact: '', value: '', stage: 'Proposal', closeDate: '' });
  const [dealToDelete, setDealToDelete] = useState(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const data = await api.get('deals');
      setDeals(data || []);
    } catch (e) {
      console.error(e);
    }
  };

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

  const handleSaveDeal = async () => {
    try {
      if (modalType === 'add') {
        await api.post('deals', currentDeal);
      } else {
        await api.put(`deals/${currentDeal.id}`, currentDeal);
      }
      await fetchDeals();
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`deals/${dealToDelete.id}`);
      await fetchDeals();
      setIsDeleteModalOpen(false);
    } catch (e) {
      console.error(e);
    }
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

export default DealsManagement;
