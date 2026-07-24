import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const PriorityBadge = ({ priority }) => {
  let bgColor = '#f3f4f6';
  let textColor = '#374151';

  switch (priority?.toLowerCase()) {
    case 'high':
      bgColor = '#fee2e2';
      textColor = '#b91c1c';
      break;
    case 'medium':
      bgColor = '#dbeafe';
      textColor = '#1e40af';
      break;
    case 'low':
      bgColor = '#ffedd5';
      textColor = '#c2410c';
      break;
    default:
      break;
  }

  return (
    <span className="manager-status-badge" style={{ backgroundColor: bgColor, color: textColor }}>
      {priority}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  let bgColor = '#f3f4f6';
  let textColor = '#374151';

  switch (status?.toLowerCase()) {
    case 'done':
      bgColor = '#dcfce7';
      textColor = '#166534';
      break;
    case 'in progress':
      bgColor = '#dbeafe';
      textColor = '#1e40af';
      break;
    case 'pending':
      bgColor = '#ffedd5';
      textColor = '#c2410c';
      break;
    default:
      break;
  }

  return (
    <span className="manager-status-badge" style={{ backgroundColor: bgColor, color: textColor }}>
      {status}
    </span>
  );
};

const TaskModal = ({ task, teamMembers, onClose, onSave }) => {
  const isEdit = !!task;
  const [formData, setFormData] = useState({
    title: task?.title || '',
    assignedTo: task?.assignedTo || '',
    dueDate: task?.dueDate || '',
    priority: task?.priority || 'Medium',
    status: task?.status || 'Pending'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="manager-modal-overlay">
      <div className="manager-modal-container manager-assign-modal" style={{ maxWidth: '500px' }}>
        <div className="manager-modal-header">
          <h2>{isEdit ? 'Edit Task' : 'Add Task'}</h2>
          <button onClick={onClose} className="manager-modal-close">
            <X size={20} />
          </button>
        </div>

        <div className="manager-modal-content">
          <div className="manager-form-group">
            <label className="manager-form-label">Title</label>
            <input 
              type="text"
              name="title"
              className="manager-form-input"
              placeholder="Task Title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="manager-form-group">
            <label className="manager-form-label">Assign To</label>
            <select 
              name="assignedTo"
              className="manager-form-select"
              value={formData.assignedTo}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.name}>{member.name}</option>
              ))}
            </select>
          </div>

          <div className="manager-form-group">
            <label className="manager-form-label">Due Date</label>
            <input 
              type="date"
              name="dueDate"
              className="manager-form-input"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="manager-form-group">
            <label className="manager-form-label">Priority</label>
            <select 
              name="priority"
              className="manager-form-select"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="manager-form-group">
            <label className="manager-form-label">Status</label>
            <select 
              name="status"
              className="manager-form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        <div className="manager-modal-footer">
          <button onClick={onClose} className="manager-btn-close">Cancel</button>
          <button onClick={handleSubmit} className="manager-btn-primary">
            {isEdit ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ onClose, onConfirm }) => {
  return (
    <div className="manager-modal-overlay">
      <div className="manager-modal-container manager-assign-modal" style={{ maxWidth: '400px' }}>
        <div className="manager-modal-header">
          <h2>Delete</h2>
          <button onClick={onClose} className="manager-modal-close">
            <X size={20} />
          </button>
        </div>

        <div className="manager-modal-content" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0 2rem 0' }}>
          <AlertTriangle size={48} color="#ef4444" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '1.05rem', fontWeight: '500', margin: 0, color: '#1f2937' }}>
            Want to Delete the Task
          </p>
        </div>

        <div className="manager-modal-footer">
          <button onClick={onConfirm} className="manager-btn-danger" style={{ marginLeft: 'auto' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ManagerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const fetchDashboardData = async () => {
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
        
        const managerUser = users.find(u => u.email === loggedInUserSession?.email);
        const managerName = managerUser?.name || loggedInUserSession?.name;

        const salesUsers = users.filter(u => 
          (u.role === 'ROLE_USER' || u.role === 'ROLE_SALES' || u.role === 'Sales Person') && 
          u.manager === managerName
        );
        setTeamMembers(salesUsers);
        
        const teamMemberNames = salesUsers.map(u => u.name);
        // Assuming tasks have 'assignedTo' or 'owner'. In previous code, tasks might have 'assignedTo'.
        const managerTasks = tasksData.filter(t => !t.assignedTo || teamMemberNames.includes(t.assignedTo));

        setTasks(managerTasks);
      }
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenAddModal = () => {
    setCurrentTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setCurrentTask(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenDeleteModal = (task) => {
    setCurrentTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    if (currentTask) {
      // Edit
      try {
        const res = await fetch(`/api/tasks/${currentTask.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(taskData)
        });
        if (res.ok) {
          const updated = await res.json();
          setTasks(tasks.map(t => t.id === updated.id ? updated : t));
        }
      } catch (err) { console.error(err); }
    } else {
      // Add
      try {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers,
          body: JSON.stringify(taskData)
        });
        if (res.ok) {
          const created = await res.json();
          setTasks([...tasks, created]);
        }
      } catch (err) { console.error(err); }
    }
    setIsTaskModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (currentTask) {
      try {
        const res = await fetch(`/api/tasks/${currentTask.id}`, {
          method: 'DELETE',
          headers
        });
        if (res.ok) {
          setTasks(tasks.filter(t => t.id !== currentTask.id));
        }
      } catch (err) { console.error(err); }
    }
    setIsDeleteModalOpen(false);
    setCurrentTask(null);
  };

  return (
    <div className="manager-page-container">
      <div className="manager-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="manager-card-title" style={{ margin: 0 }}>Team Tasks</h2>
          <button className="manager-btn-primary" onClick={handleOpenAddModal}>
            + Add Task
          </button>
        </div>
        
        <div className="manager-table-wrapper">
          <table className="manager-table">
            <thead>
              <tr>
                <th>TITLE</th>
                <th>ASSIGNED TO</th>
                <th>PRIORITY</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td style={{ fontWeight: '600', color: '#111827' }}>{task.title}</td>
                  <td>{task.assignedTo || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Unassigned</span>}</td>
                  <td><PriorityBadge priority={task.priority} /></td>
                  <td><StatusBadge status={task.status} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
                      <button 
                        className="manager-text-link"
                        onClick={() => handleOpenEditModal(task)}
                      >
                        Edit
                      </button>
                      <button 
                        className="manager-btn-danger-sm"
                        onClick={() => handleOpenDeleteModal(task)}
                      >
                        Delete
                      </button>
                    </div>
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

      {isTaskModalOpen && (
        <TaskModal 
          task={currentTask} 
          teamMembers={teamMembers}
          onClose={() => setIsTaskModalOpen(false)} 
          onSave={handleSaveTask} 
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal 
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default ManagerTasks;
