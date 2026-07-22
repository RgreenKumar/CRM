import { useState } from 'react';

const TaskManagement = ({ tasks, setTasks, users }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentTask, setCurrentTask] = useState({ title: '', assignedTo: '', dueDate: '', priority: 'Medium', status: 'Pending' });
  const [taskToDelete, setTaskToDelete] = useState(null);

  const filteredTasks = tasks.filter(task => {
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.assignedTo.toLowerCase().includes(query) ||
      task.priority.toLowerCase().includes(query) ||
      task.status.toLowerCase().includes(query)
    );
  });

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High': return { backgroundColor: '#fee2e2', color: '#ef4444' };
      case 'Medium': return { backgroundColor: '#ffedd5', color: '#f97316' };
      case 'Low': return { backgroundColor: '#dcfce7', color: '#22c55e' };
      default: return { backgroundColor: '#f3f4f6', color: '#6b7280' };
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return { backgroundColor: '#ffedd5', color: '#f97316' };
      case 'In Progress': return { backgroundColor: '#dbeafe', color: '#3b82f6' };
      case 'Done': return { backgroundColor: '#dcfce7', color: '#22c55e' };
      default: return { backgroundColor: '#f3f4f6', color: '#6b7280' };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const date = new Date(dateStr);
    return isNaN(date) ? dateStr : date.toLocaleDateString('en-GB', options);
  };

  const handleAddClick = () => {
    setModalType('add');
    setCurrentTask({ title: '', assignedTo: '', dueDate: '', priority: 'Medium', status: 'Pending' });
    setIsModalOpen(true);
  };

  const handleEditClick = (task) => {
    setModalType('edit');
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleSaveTask = () => {
    if (modalType === 'add') {
      setTasks([...tasks, { ...currentTask, id: Date.now() }]);
    } else {
      setTasks(tasks.map(t => t.id === currentTask.id ? currentTask : t));
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    setTasks(tasks.filter(t => t.id !== taskToDelete.id));
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
          <h3 style={{ margin: 0, fontSize: '16px', color: '#1f2937', fontWeight: '600' }}>All Tasks</h3>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={handleAddClick}
              style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>+</span> Add Tasks
            </button>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', color: '#6b7280', fontSize: '11px', fontWeight: '600', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>TITLE</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>ASSIGNED TO</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>DUE DATE</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>PRIORITY</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>STATUS</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px 24px', color: '#1f2937', fontSize: '14px', fontWeight: '600' }}>{task.title}</td>
                <td style={{ padding: '16px 24px', color: '#6b7280', fontSize: '14px' }}>{task.assignedTo}</td>
                <td style={{ padding: '16px 24px', color: '#6b7280', fontSize: '14px' }}>{formatDate(task.dueDate)}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    ...getPriorityStyle(task.priority),
                    padding: '4px 12px', 
                    borderRadius: '9999px', 
                    fontSize: '12px', 
                    fontWeight: '500' 
                  }}>
                    {task.priority}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    ...getStatusStyle(task.status),
                    padding: '4px 12px', 
                    borderRadius: '9999px', 
                    fontSize: '12px', 
                    fontWeight: '500' 
                  }}>
                    {task.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button onClick={() => handleEditClick(task)} style={{ backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>Edit</button>
                  <button onClick={() => handleDeleteClick(task)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>Delete</button>
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
                {modalType === 'add' ? 'Add Task' : 'Edit Task'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Title</label>
                <input 
                  type="text" 
                  value={currentTask.title} 
                  onChange={(e) => setCurrentTask({...currentTask, title: e.target.value})}
                  placeholder="Task Title"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Assign To</label>
                <select 
                  value={currentTask.assignedTo} 
                  onChange={(e) => setCurrentTask({...currentTask, assignedTo: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}
                >
                  <option value="">-- Select User --</option>
                  {users && users.map(u => (
                    <option key={u.id} value={u.name}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Due Date</label>
                <input 
                  type="date" 
                  value={currentTask.dueDate} 
                  onChange={(e) => setCurrentTask({...currentTask, dueDate: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Priority</label>
                <select 
                  value={currentTask.priority} 
                  onChange={(e) => setCurrentTask({...currentTask, priority: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Status</label>
                <select 
                  value={currentTask.status} 
                  onChange={(e) => setCurrentTask({...currentTask, status: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
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
                onClick={handleSaveTask}
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
              <h2 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: '600', color: '#111827' }}>Delete tasks</h2>
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

export default TaskManagement;
