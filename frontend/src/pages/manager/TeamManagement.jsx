import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Status badge component
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

const PerformanceModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="manager-modal-overlay">
      <div className="manager-modal-container">
        <div className="manager-modal-header">
          <h2>Performance — {user.name}</h2>
          <button onClick={onClose} className="manager-modal-close">
            <X size={20} />
          </button>
        </div>

        <div className="manager-modal-content">
          {/* Stats Grid */}
          <div className="manager-modal-stats">
            <div className="manager-modal-stat-card">
              <span className="manager-stat-label">TOTAL LEADS</span>
              <span className="manager-stat-value">{user.totalLeads}</span>
            </div>
            <div className="manager-modal-stat-card">
              <span className="manager-stat-label">OPEN DEALS</span>
              <span className="manager-stat-value">{user.openDeals}</span>
            </div>
            <div className="manager-modal-stat-card">
              <span className="manager-stat-label">WON</span>
              <span className="manager-stat-value">{user.wonDeals || 1}</span>
            </div>
          </div>

          {/* Leads Section */}
          <div className="manager-modal-section">
            <h3>Leads</h3>
            <table className="manager-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {user.leads.map((lead, idx) => (
                  <tr key={idx}>
                    <td>{lead.name}</td>
                    <td><StatusBadge status={lead.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Deals Section */}
          <div className="manager-modal-section">
            <h3>Deals</h3>
            <table className="manager-table">
              <thead>
                <tr>
                  <th>TITLE</th>
                  <th>STAGE</th>
                  <th>VALUE</th>
                </tr>
              </thead>
              <tbody>
                {user.deals.length > 0 ? (
                  user.deals.map((deal, idx) => (
                    <tr key={idx}>
                      <td>{deal.title}</td>
                      <td><StatusBadge status={deal.stage} /></td>
                      <td>{deal.value}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', color: '#6b7280' }}>No deals found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="manager-modal-footer">
          <button onClick={onClose} className="manager-btn-close">Close</button>
        </div>
      </div>
    </div>
  );
};

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, leadsRes, dealsRes] = await Promise.all([
          fetch('/api/users', { headers }),
          fetch('/api/leads', { headers }),
          fetch('/api/deals', { headers })
        ]);

        if (usersRes.ok && leadsRes.ok && dealsRes.ok) {
          const users = await usersRes.json();
          const leads = await leadsRes.json();
          const deals = await dealsRes.json();
          
          const loggedInUserStr = localStorage.getItem('user');
          const loggedInUserSession = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;
          
          const managerUser = users.find(u => u.email === loggedInUserSession?.email);
          const managerName = managerUser?.name || loggedInUserSession?.name;

          const salesUsers = users.filter(u => 
            (u.role === 'ROLE_USER' || u.role === 'ROLE_SALES' || u.role === 'Sales Person') && 
            u.manager === managerName
          );
          
          const enrichedMembers = salesUsers.map(user => {
            const userLeads = leads.filter(l => l.assignedTo === user.name);
            const userDeals = deals.filter(d => d.assignedTo === user.name);
            
            const totalLeads = userLeads.length;
            const wonDeals = userDeals.filter(d => d.stage?.toLowerCase() === 'won').length;
            const openDeals = userDeals.length - wonDeals;

            return {
              ...user,
              totalLeads,
              openDeals,
              wonDeals,
              leads: userLeads,
              deals: userDeals
            };
          });

          setTeamMembers(enrichedMembers);
        }
      } catch (err) {
        console.error("Error fetching team performance data", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="manager-page-container">
      <div className="manager-card">
        <h2 className="manager-card-title">Team Performance</h2>
        <div className="manager-table-wrapper">
          <table className="manager-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>TOTAL LEADS</th>
                <th>OPEN DEALS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id}>
                  <td style={{ fontWeight: '600', color: '#111827' }}>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.totalLeads}</td>
                  <td>{member.openDeals}</td>
                  <td>
                    <button 
                      className="manager-action-btn"
                      onClick={() => setSelectedUser(member)}
                    >
                      Performance
                    </button>
                  </td>
                </tr>
              ))}
              {teamMembers.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No team members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <PerformanceModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
};

export default TeamManagement;
