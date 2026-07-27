import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

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

  return (
    <span className="manager-status-badge" style={{ backgroundColor: bgColor, color: textColor }}>
      {status || 'Unknown'}
    </span>
  );
};

const AssignLeadModal = ({ lead, teamMembers, onClose, onAssign }) => {
  const [selectedUser, setSelectedUser] = useState(lead.assignedSalesperson || '');

  const handleAssign = () => {
    onAssign(lead, selectedUser);
  };

  if (!lead) return null;

  return (
    <div className="manager-modal-overlay">
      <div className="manager-modal-container manager-assign-modal">
        <div className="manager-modal-header">
          <h2>Assign Lead</h2>
          <button onClick={onClose} className="manager-modal-close">
            <X size={20} />
          </button>
        </div>

        <div className="manager-modal-content">
          <p className="manager-assign-lead-text">
            Lead: <strong>{lead.name}</strong>
          </p>

          <div className="manager-form-group">
            <label className="manager-form-label">Assign To</label>
            <select 
              className="manager-form-select"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="" disabled>Select Team Member</option>
              {teamMembers.filter(m => m.status === 'Active').map((member) => (
                <option key={member.id} value={member.name}>{member.name}</option>
              ))}
              <option value="Unassigned">Unassigned</option>
            </select>
          </div>
        </div>

        <div className="manager-modal-footer">
          <button onClick={onClose} className="manager-btn-close">Cancel</button>
          <button onClick={handleAssign} className="manager-btn-primary">Assign</button>
        </div>
      </div>
    </div>
  );
};

const ManagerLeads = () => {
  const [leads, setLeads] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [leadToAssign, setLeadToAssign] = useState(null);

  const { rolePermissions } = useSettings();
  const getPermission = (name) => {
    if (!rolePermissions) return true;
    const perm = rolePermissions.find(p => p.name === name);
    return perm ? perm.manager : true;
  };
  const canAssignLeads = getPermission('Assign Leads');

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const fetchDashboardData = async () => {
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
        
        const managerUser = users.find(u => u.email === loggedInUserSession?.email);
        const managerName = managerUser?.name || loggedInUserSession?.name;

        const salesUsers = users.filter(u => 
          (u.role === 'ROLE_USER' || u.role === 'ROLE_SALES' || u.role === 'Sales Person') && 
          u.manager === managerName
        );
        setTeamMembers(salesUsers);
        
        const teamMemberNames = salesUsers.map(u => u.name);
        const managerLeads = leadsData.filter(l => l.assignedManager === managerName);

        setLeads(managerLeads);
      }
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAssignSubmit = async (lead, newAssignee) => {
    const updatedAssignedSalesperson = newAssignee === 'Unassigned' ? '' : newAssignee;
    const updatedLead = { ...lead, assignedSalesperson: updatedAssignedSalesperson };

    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedLead)
      });
      if (res.ok) {
        const savedLead = await res.json();
        setLeads(leads.map(l => l.id === savedLead.id ? savedLead : l));
        setLeadToAssign(null);
      }
    } catch (err) {
      console.error("Error assigning lead", err);
    }
  };

  return (
    <div className="manager-page-container">
      <div className="manager-card">
        <h2 className="manager-card-title">Team Leads</h2>
        <div className="manager-table-wrapper">
          <table className="manager-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>STATUS</th>
                <th>SALES PERSON</th>
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
                  <td>{lead.assignedSalesperson || 'Unassigned'}</td>
                  <td>
                    {canAssignLeads ? (
                      <button 
                        className="manager-action-btn"
                        onClick={() => setLeadToAssign(lead)}
                      >
                        {lead.assignedSalesperson && lead.assignedSalesperson !== 'Unassigned' ? 'Reassign' : 'Assign'}
                      </button>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '0.85rem', fontStyle: 'italic' }}>View Only</span>
                    )}
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No leads available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {leadToAssign && (
        <AssignLeadModal 
          lead={leadToAssign} 
          teamMembers={teamMembers}
          onClose={() => setLeadToAssign(null)} 
          onAssign={handleAssignSubmit}
        />
      )}
    </div>
  );
};

export default ManagerLeads;
