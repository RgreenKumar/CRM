import React, { useState, useEffect } from 'react';

const PriorityBadge = ({ priority }) => {
  let bgColor = '#f3f4f6';
  let textColor = '#374151';
  let label = priority || 'Unknown';

  switch (priority?.toLowerCase()) {
    case 'high':
      bgColor = '#fee2e2';
      textColor = '#ef4444';
      break;
    case 'medium':
      bgColor = '#ffedd5';
      textColor = '#f97316';
      break;
    case 'low':
      bgColor = '#f1f5f9';
      textColor = '#64748b';
      break;
    default:
      break;
  }

  return (
    <span style={{ backgroundColor: bgColor, color: textColor, padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
      {label}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  let bgColor = '#f3f4f6';
  let textColor = '#374151';
  let label = status || 'Unknown';

  switch (status?.toLowerCase()) {
    case 'done':
      bgColor = '#dcfce7';
      textColor = '#22c55e';
      break;
    case 'in progress':
      bgColor = '#e0e7ff';
      textColor = '#3b82f6';
      break;
    case 'pending':
      bgColor = '#ffedd5';
      textColor = '#f97316';
      break;
    default:
      break;
  }

  return (
    <span style={{ backgroundColor: bgColor, color: textColor, padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
      {label}
    </span>
  );
};

const SalesTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [salesName, setSalesName] = useState('');
  
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    assignedTo: '',
    dueDate: '',
    status: 'Pending'
  });

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const fetchTasks = async () => {
    try {
      const [usersRes, tasksRes] = await Promise.all([
        fetch('/api/users', { headers }),
        fetch('/api/tasks', { headers })
      ]);

      if (usersRes.ok && tasksRes.ok) {
        const users = await usersRes.json();
        const tasksData = await tasksRes.json();
        
        const loggedInUserStr = localStorage.getItem('user');
        const loggedInUserSession = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;
        
        const salesUser = users.find(u => u.email === loggedInUserSession?.email);
        const name = salesUser?.name || loggedInUserSession?.name;
        setSalesName(name);

        const myTasks = tasksData.filter(t => t.assignedTo === name);
        setTasks(myTasks);
      }
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpenUpdateModal = (task) => {
    setCurrentTask(task);
    setFormData({
      title: task.title || '',
      assignedTo: task.assignedTo || salesName,
      dueDate: task.dueDate || '',
      status: task.status || 'Pending'
    });
    setIsUpdateModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!currentTask) return;

    // keep priority the same as original task since it's not in the edit modal
    const updatePayload = {
      ...currentTask,
      ...formData
    };

    try {
      const res = await fetch(`/api/tasks/${currentTask.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatePayload)
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
    }
    setIsUpdateModalOpen(false);
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
        <h2 style={{ margin: '0 0 24px 0', fontSize: '1.25rem', color: '#111827', fontWeight: '600' }}>My Tasks</h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                <th style={{ padding: '16px', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>TITLE</th>
                <th style={{ padding: '16px', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>DUE DATE</th>
                <th style={{ padding: '16px', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>PRIORITY</th>
                <th style={{ padding: '16px', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>STATUS</th>
                <th style={{ padding: '16px', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '16px', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>{task.title}</td>
                  <td style={{ padding: '16px', color: '#6b7280', fontSize: '0.9rem' }}>{task.dueDate}</td>
                  <td style={{ padding: '16px' }}><PriorityBadge priority={task.priority} /></td>
                  <td style={{ padding: '16px' }}><StatusBadge status={task.status} /></td>
                  <td style={{ padding: '16px' }}>
                    <button 
                      onClick={() => handleOpenUpdateModal(task)}
                      style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isUpdateModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <button 
              onClick={() => setIsUpdateModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9ca3af' }}
            >
              ×
            </button>
            <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '1.25rem', color: '#111827' }}>Update Task</h3>
            
            <form onSubmit={handleUpdateTask}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }} 
                  required 
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>Assign To</label>
                <input 
                  type="text" 
                  name="assignedTo" 
                  value={formData.assignedTo} 
                  onChange={handleInputChange} 
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }} 
                  required 
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>Due Date</label>
                <input 
                  type="text" 
                  name="dueDate" 
                  value={formData.dueDate} 
                  onChange={handleInputChange} 
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }} 
                  required 
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>Status</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleInputChange} 
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
                  required
                >
                  <option value="Done">Done</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsUpdateModalOpen(false)}
                  style={{ padding: '8px 16px', border: 'none', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '8px 16px', border: 'none', backgroundColor: '#3b82f6', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTasks;
