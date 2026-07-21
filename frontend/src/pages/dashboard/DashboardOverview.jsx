import React, { useState, useEffect } from 'react';
import { api } from '../../api';

const DashboardOverview = () => {
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, leadsData, dealsData] = await Promise.all([
          api.get('users'),
          api.get('leads'),
          api.get('deals')
        ]);
        setUsers(usersData || []);
        setLeads(leadsData || []);
        setDeals(dealsData || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);
  const activeUsersCount = users.filter(u => u.status === 'Active').length;
  const activeLeads = leads.filter(l => l.status !== 'Not Interested');
  const totalLeadsCount = activeLeads.length;

  const recentLeads = activeLeads.slice(0, 4);

  const parseValue = (valStr) => {
    if (!valStr) return 0;
    const cleanStr = valStr.toString().replace(/,/g, '');
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
  };

  const formatCurrency = (num) => {
    return '₹' + num.toLocaleString('en-IN');
  };

  const totalDeals = deals.length;
  const wonDeals = deals.filter(d => d.stage === 'Won');
  const wonDealsCount = wonDeals.length;
  const totalRevenue = wonDeals.reduce((sum, d) => sum + parseValue(d.value), 0);
  
  const conversionRate = totalLeadsCount > 0 
    ? ((wonDealsCount / totalLeadsCount) * 100).toFixed(1) + '%'
    : '0%';

  const getStatusStyle = (status) => {
    switch (status) {
      case 'New': return { backgroundColor: '#dbeafe', color: '#3b82f6' };
      case 'Contacted': return { backgroundColor: '#ede9fe', color: '#8b5cf6' };
      case 'Interested': return { backgroundColor: '#ffedd5', color: '#f97316' };
      case 'Qualified': return { backgroundColor: '#dcfce7', color: '#22c55e' };
      case 'Not Interested': return { backgroundColor: '#fee2e2', color: '#ef4444' };
      default: return { backgroundColor: '#f3f4f6', color: '#6b7280' };
    }
  };

  const revenueData = [
    { month: 'Jan', height: '40%' },
    { month: 'Feb', height: '60%' },
    { month: 'Mar', height: '55%' },
    { month: 'Apr', height: '70%' },
    { month: 'May', height: '80%' },
    { month: 'Jul', height: '55%' },
    { month: 'Jun', height: '85%' },
    { month: 'Aug', height: '100%' },
  ];

  return (
    <div>
      <div className="dashboard-stats">
        <div className="stat-card">
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ width: '36px', height: '36px', background: '#f3e8ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              🧑‍🤝‍🧑
            </div>
          </div>
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{activeUsersCount}</div>
          <div className="stat-subtext">Active accounts</div>
        </div>
        <div className="stat-card">
          <div style={{ marginBottom: '1rem', height: '36px', display: 'flex', alignItems: 'center', fontSize: '32px' }}>
            👥
          </div>
          <div className="stat-label">Total Leads</div>
          <div className="stat-value">{totalLeadsCount}</div>
          <div className="stat-subtext">All sources</div>
        </div>
        <div className="stat-card">
          <div style={{ marginBottom: '1rem', height: '36px', display: 'flex', alignItems: 'center', fontSize: '32px' }}>
            🔥
          </div>
          <div className="stat-label">Total Deals</div>
          <div className="stat-value">{totalDeals}</div>
          <div className="stat-subtext">{wonDealsCount} won</div>
        </div>
        <div className="stat-card">
          <div style={{ marginBottom: '1rem', height: '36px', display: 'flex', alignItems: 'center', fontSize: '32px' }}>
            📈
          </div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">{formatCurrency(totalRevenue)}</div>
          <div className="stat-subtext">From won deals</div>
        </div>
        <div className="stat-card">
          <div style={{ marginBottom: '1rem', height: '36px', display: 'flex', alignItems: 'center', fontSize: '32px' }}>
            ⭐
          </div>
          <div className="stat-label">Conversion Rate</div>
          <div className="stat-value">{conversionRate}</div>
          <div className="stat-subtext">Won deals / Active leads</div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-panel">
          <h3 className="panel-title">Recent Leads</h3>
          <table className="leads-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Source</th>
                <th>Status</th>
                <th>Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead, index) => (
                <tr key={index}>
                  <td>
                    <div className="lead-name">{lead.name}</div>
                    <div className="lead-email">{lead.email}</div>
                  </td>
                  <td>
                    <div className="lead-source">{lead.source}</div>
                  </td>
                  <td>
                    <span style={{ 
                      ...getStatusStyle(lead.status),
                      padding: '4px 12px', 
                      borderRadius: '9999px', 
                      fontSize: '12px', 
                      fontWeight: '500',
                      display: 'inline-block'
                    }}>{lead.status}</span>
                  </td>
                  <td>
                    <div className="lead-assignee">{lead.assignedTo}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dashboard-panel">
          <h3 className="panel-title">Monthly Revenue</h3>
          <div className="chart-container">
            {revenueData.map((data, index) => (
              <div key={index} className="chart-bar-group">
                <div className="chart-bar" style={{ height: data.height }}></div>
                <div className="chart-label">{data.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
