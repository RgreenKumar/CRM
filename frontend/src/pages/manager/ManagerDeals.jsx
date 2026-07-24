import React, { useState, useEffect } from 'react';

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
    <span className="manager-status-badge" style={{ backgroundColor: bgColor, color: textColor }}>
      {status || 'Unknown'}
    </span>
  );
};

const ManagerDeals = () => {
  const [deals, setDeals] = useState([]);
  const [filterStage, setFilterStage] = useState('All Stages');

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      try {
        const [usersRes, dealsRes] = await Promise.all([
          fetch('/api/users', { headers }),
          fetch('/api/deals', { headers })
        ]);

        if (usersRes.ok && dealsRes.ok) {
          const users = await usersRes.json();
          const dealsData = await dealsRes.json();
          
          const loggedInUserStr = localStorage.getItem('user');
          const loggedInUserSession = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;
          
          const managerUser = users.find(u => u.email === loggedInUserSession?.email);
          const managerName = managerUser?.name || loggedInUserSession?.name;

          const teamMembersList = users.filter(u => 
            (u.role === 'ROLE_USER' || u.role === 'ROLE_SALES' || u.role === 'Sales Person') && 
            u.manager === managerName
          );
          const teamMemberNames = teamMembersList.map(u => u.name);

          const managerDeals = dealsData.filter(d => !d.assignedTo || d.assignedTo === 'Unassigned' || teamMemberNames.includes(d.assignedTo));

          setDeals(managerDeals);
        }
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    fetchDashboardData();
  }, []);

  const filteredDeals = filterStage === 'All Stages' 
    ? deals 
    : deals.filter(deal => deal.stage?.toLowerCase() === filterStage.toLowerCase());

  return (
    <div className="manager-page-container">
      <div className="manager-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="manager-card-title" style={{ margin: 0 }}>Team Deals</h2>
          
          <select 
            className="manager-form-select"
            style={{ width: 'auto', padding: '0.4rem 1rem' }}
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
          >
            <option value="All Stages">All Stages</option>
            <option value="Discovery">Discovery</option>
            <option value="Proposal">Proposal</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
        
        <div className="manager-table-wrapper">
          <table className="manager-table">
            <thead>
              <tr>
                <th>TITLE</th>
                <th>VALUE</th>
                <th>STAGE</th>
                <th>ASSIGNED TO</th>
                <th>EXPECTED CLOSE</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((deal) => (
                <tr key={deal.id}>
                  <td style={{ fontWeight: '600', color: '#111827' }}>{deal.title}</td>
                  <td>{deal.value}</td>
                  <td><StatusBadge status={deal.stage} /></td>
                  <td>{deal.assignedTo || 'Unassigned'}</td>
                  <td>{deal.expectedCloseDate || '-'}</td>
                </tr>
              ))}
              {filteredDeals.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No deals found for this stage.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerDeals;
