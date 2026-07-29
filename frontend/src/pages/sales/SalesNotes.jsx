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
          <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.25rem', color: '#111827' }}>Delete Note</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'absolute', top: '16px', right: '16px' }}>
            <X size={20} color="#9ca3af" />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0 2rem 0' }}>
          <AlertTriangle size={48} color="#ef4444" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '1.05rem', fontWeight: '500', margin: 0, color: '#1f2937' }}>
            Want to Delete the Note?
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

const SalesNotes = () => {
  const [notes, setNotes] = useState([]);
  const [leads, setLeads] = useState([]);
  const [salesName, setSalesName] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    linkedTo: '',
    content: ''
  });

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const fetchData = async () => {
    try {
      const [usersRes, leadsRes, notesRes] = await Promise.all([
        fetch('/api/users', { headers }),
        fetch('/api/leads', { headers }),
        fetch('/api/notes', { headers })
      ]);

      let name = '';
      if (usersRes.ok) {
        const users = await usersRes.json();
        const loggedInUserStr = localStorage.getItem('user');
        const loggedInUserSession = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;
        const salesUser = users.find(u => u.email === loggedInUserSession?.email);
        name = salesUser?.name || loggedInUserSession?.name;
        setSalesName(name);
      }

      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        const myLeads = leadsData.filter(l => l.assignedSalesperson === name);
        setLeads(myLeads.length > 0 ? myLeads : leadsData);
      }

      if (notesRes.ok) {
        const notesData = await notesRes.json();
        // Assuming notes have an 'owner' or 'salesPerson' field
        const myNotes = notesData.filter(n => n.salesPerson === name || !n.salesPerson);
        setNotes(myNotes);
      } else {
        console.error("Failed to fetch notes, status:", notesRes.status);
      }
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setCurrentNote(null);
    setFormData({
      title: '',
      linkedTo: '',
      content: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note) => {
    setCurrentNote(note);
    setFormData({
      title: note.title || '',
      linkedTo: note.linkedTo || '',
      content: note.content || ''
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      salesPerson: salesName,
      date: currentNote ? currentNote.date : new Date().toLocaleDateString('en-GB')
    };

    if (currentNote) {
      try {
        const res = await fetch(`/api/notes/${currentNote.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          fetchData();
        } else {
          console.error("Failed to update note");
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const res = await fetch('/api/notes', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          fetchData();
        } else {
          console.error("Failed to create note");
        }
      } catch (err) {
        console.error(err);
      }
    }
    setIsModalOpen(false);
  };

  const handleDeleteOpen = (id) => {
    setItemToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/notes/${itemToDelete}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        fetchData();
      } else {
        setNotes(notes.filter(n => n.id !== itemToDelete));
      }
    } catch (err) {
      console.error(err);
    }
    setIsDeleteOpen(false);
    setItemToDelete(null);
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
    borderRadius: '12px',
    width: '450px',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
    position: 'relative'
  };

  return (
    <div className="sales-page-container">
      <div className="sales-card" style={{ padding: '24px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#111827', fontWeight: '600' }}>My Notes</h2>
          <button 
            onClick={handleOpenAddModal}
            style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
          >
            + Add Note
          </button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                <th style={{ padding: '16px', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>TITLE</th>
                <th style={{ padding: '16px', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>LINKED TO</th>
                <th style={{ padding: '16px', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>DATE</th>
                <th style={{ padding: '16px', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => (
                <tr key={note.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '600', color: '#111827', fontSize: '0.9rem', marginBottom: '4px' }}>{note.title}</div>
                    <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{note.content?.length > 40 ? note.content.substring(0, 40) + '...' : note.content}</div>
                  </td>
                  <td style={{ padding: '16px', color: '#6b7280', fontSize: '0.9rem' }}>
                    {note.linkedTo ? `lead: ${note.linkedTo}` : '-'}
                  </td>
                  <td style={{ padding: '16px', color: '#6b7280', fontSize: '0.9rem' }}>{note.date}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                      <button 
                        onClick={() => handleOpenEditModal(note)}
                        style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteOpen(note.id)}
                        style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {notes.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No notes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9ca3af' }}
            >
              ×
            </button>
            <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '1.25rem', color: '#111827' }}>
              {currentNote ? 'Edit Note' : 'Add Note'}
            </h3>
            
            <form onSubmit={handleSaveNote}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  placeholder="Note Title"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }} 
                  required 
                />
              </div>

              {!currentNote && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>Linked To</label>
                  <select 
                    name="linkedTo" 
                    value={formData.linkedTo} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
                  >
                    <option value="">-- Select --</option>
                    {leads.map(lead => (
                      <option key={lead.id} value={lead.name}>{lead.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>Note</label>
                <textarea 
                  name="content" 
                  value={formData.content} 
                  onChange={handleInputChange} 
                  placeholder={currentNote ? formData.content : "Write your note..."}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box', minHeight: '100px', resize: 'vertical' }} 
                  required 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px', border: 'none', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '8px 16px', border: 'none', backgroundColor: '#3b82f6', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                >
                  {currentNote ? 'Update' : 'Save'}
                </button>
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

export default SalesNotes;
