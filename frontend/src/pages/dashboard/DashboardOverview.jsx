import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

const DashboardOverview = ({ users, leads = [], deals = [] }) => {
  const { currency, pipelineStages } = useSettings();

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
    return currency.symbol + num.toLocaleString('en-IN');
  };

  const getDealStatus = (dealStage) => {
    const stageObj = pipelineStages.find(s => s.name === dealStage || s.name.toLowerCase().includes(dealStage.toLowerCase()));
    return stageObj ? (stageObj.status || 'Open') : 'Open';
  };

  const totalDeals = deals.length;
  const wonDeals = deals.filter(d => getDealStatus(d.stage) === 'Won');
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

  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyRevenue = {};
  allMonths.forEach(m => monthlyRevenue[m] = 0);

  wonDeals.forEach(deal => {
    if (deal.closeDate) {
      const date = new Date(deal.closeDate);
      if (!isNaN(date)) {
        const monthName = allMonths[date.getMonth()];
        monthlyRevenue[monthName] += parseValue(deal.value);
      }
    }
  });

  const maxRevenue = Math.max(...Object.values(monthlyRevenue));

  const revenueData = allMonths.map(month => {
    const value = monthlyRevenue[month];
    const height = maxRevenue > 0 ? `${(value / maxRevenue) * 100}%` : '0%';
    return { month, height, value };
  });

  return (
    <div>
      <div className="dashboard-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', padding: '1rem', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', background: '#f3e8ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
            🧑‍🤝‍🧑
          </div>
          <div>
            <div className="stat-label" style={{ fontSize: '0.875rem' }}>Total Users</div>
            <div className="stat-value" style={{ fontSize: '1.25rem', margin: '0.125rem 0' }}>{activeUsersCount}</div>
            <div className="stat-subtext" style={{ fontSize: '0.75rem', margin: 0 }}>Active accounts</div>
          </div>
        </div>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', padding: '1rem', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', background: '#e0e7ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
            👥
          </div>
          <div>
            <div className="stat-label" style={{ fontSize: '0.875rem' }}>Total Leads</div>
            <div className="stat-value" style={{ fontSize: '1.25rem', margin: '0.125rem 0' }}>{totalLeadsCount}</div>
            <div className="stat-subtext" style={{ fontSize: '0.75rem', margin: 0 }}>All sources</div>
          </div>
        </div>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', padding: '1rem', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', background: '#fef3c7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
            🔥
          </div>
          <div>
            <div className="stat-label" style={{ fontSize: '0.875rem' }}>Total Deals</div>
            <div className="stat-value" style={{ fontSize: '1.25rem', margin: '0.125rem 0' }}>{totalDeals}</div>
            <div className="stat-subtext" style={{ fontSize: '0.75rem', margin: 0 }}>{wonDealsCount} won</div>
          </div>
        </div>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', padding: '1rem', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', background: '#dcfce7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
            📈
          </div>
          <div>
            <div className="stat-label" style={{ fontSize: '0.875rem' }}>Total Revenue</div>
            <div className="stat-value" style={{ fontSize: '1.25rem', margin: '0.125rem 0' }}>{formatCurrency(totalRevenue)}</div>
            <div className="stat-subtext" style={{ fontSize: '0.75rem', margin: 0 }}>From won deals</div>
          </div>
        </div>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', padding: '1rem', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', background: '#fce7f3', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
            ⭐
          </div>
          <div>
            <div className="stat-label" style={{ fontSize: '0.875rem' }}>Conversion Rate</div>
            <div className="stat-value" style={{ fontSize: '1.25rem', margin: '0.125rem 0' }}>{conversionRate}</div>
            <div className="stat-subtext" style={{ fontSize: '0.75rem', margin: 0 }}>Won / Active leads</div>
          </div>
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
                    <div className="lead-assignee">{lead.assignedManager}</div>
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
              <div key={index} className="chart-bar-group" title={formatCurrency(data.value)}>
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
