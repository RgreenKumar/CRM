import React, { useState, useEffect } from 'react';

const StatCard = ({ title, value }) => (
  <div className="manager-card manager-stat-card">
    <h3 className="manager-stat-title">{title}</h3>
    <div className="manager-stat-value">{value}</div>
  </div>
);

const MonthlyDealsChart = ({ data }) => {
  const maxDeals = Math.max(...data.map(d => d.deals), 8); // At least 8 for y-axis
  
  // Create 5 y-axis labels
  const yLabels = [];
  for (let i = 4; i >= 0; i--) {
    yLabels.push(Math.round((maxDeals / 4) * i));
  }

  return (
    <div className="manager-chart-container">
      <div className="manager-chart-y-axis">
        {yLabels.map(label => (
          <div key={label} className="manager-chart-label">{label}</div>
        ))}
      </div>
      <div className="manager-chart-area" style={{ position: 'relative' }}>
        {yLabels.map(label => (
          <div key={`grid-${label}`} className="manager-chart-grid-line"></div>
        ))}
        
        {/* Render Bars */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'flex-end', paddingBottom: '30px' }}>
          {data.map((item, index) => {
            const heightPercentage = maxDeals > 0 ? (item.deals / maxDeals) * 100 : 0;
            return (
              <div key={index} style={{ flex: 1, display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'flex-end' }}>
                <div 
                  title={`${item.deals} deals`}
                  style={{ 
                    width: '30px', 
                    height: `${heightPercentage}%`, 
                    backgroundColor: '#6366f1', 
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s ease'
                  }}
                ></div>
              </div>
            );
          })}
        </div>

        <div className="manager-chart-x-axis" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          {data.map(item => (
            <div key={item.month} className="manager-chart-label" style={{ textAlign: 'center', flex: 1 }}>{item.month}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ManagerReports = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalDeals: 0,
    conversionRate: '0.0%',
    performanceData: [],
    monthlyData: []
  });

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  useEffect(() => {
    const fetchReportData = async () => {
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
          const teamMemberNames = salesUsers.map(u => u.name);

          const managerLeads = leads.filter(l => teamMemberNames.includes(l.assignedTo));
          const managerDeals = deals.filter(d => teamMemberNames.includes(d.assignedTo));

          const totalLeads = managerLeads.length;
          const totalDeals = managerDeals.length;
          const wonDeals = managerDeals.filter(d => d.stage?.toLowerCase() === 'won').length;
          
          let conversionRate = '0.0%';
          if (totalLeads > 0) {
            conversionRate = ((wonDeals / totalLeads) * 100).toFixed(1) + '%';
          }
          
          const performanceData = salesUsers.map(user => {
            const userLeadsCount = leads.filter(l => l.assignedTo === user.name).length;
            const userDeals = deals.filter(d => d.assignedTo === user.name);
            const userWonDealsCount = userDeals.filter(d => d.stage?.toLowerCase() === 'won').length;

            return {
              id: user.id,
              salesperson: user.name,
              leads: userLeadsCount,
              deals: userDeals.length,
              won: userWonDealsCount
            };
          });

          const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          
          // Get last 12 months
          const currentMonthIdx = new Date().getMonth();
          const last12Months = [];
          for (let i = 11; i >= 0; i--) {
            let mIdx = currentMonthIdx - i;
            if (mIdx < 0) mIdx += 12;
            last12Months.push(allMonths[mIdx]);
          }

          const monthlyCounts = {};
          last12Months.forEach(m => monthlyCounts[m] = 0);

          managerDeals.forEach(deal => {
            if (deal.closeDate) {
              const date = new Date(deal.closeDate);
              if (!isNaN(date)) {
                const monthName = allMonths[date.getMonth()];
                if (monthlyCounts[monthName] !== undefined) {
                  monthlyCounts[monthName]++;
                }
              }
            }
          });

          const monthlyData = last12Months.map(month => ({
            month,
            deals: monthlyCounts[month]
          }));

          setStats({
            totalLeads,
            totalDeals,
            conversionRate,
            performanceData,
            monthlyData
          });
        }
      } catch (err) {
        console.error("Error fetching report data", err);
      }
    };

    fetchReportData();
  }, []);

  return (
    <div className="manager-page-container">
      
      {/* Top Stat Cards */}
      <div className="manager-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <StatCard title="TOTAL LEADS" value={stats.totalLeads} />
        <StatCard title="TOTAL DEALS" value={stats.totalDeals} />
        <StatCard title="CONVERSION RATE" value={stats.conversionRate} />
      </div>

      {/* Team Performance Table */}
      <div className="manager-card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="manager-card-title">Team Performance</h2>
        <div className="manager-table-wrapper">
          <table className="manager-table">
            <thead>
              <tr>
                <th>SALESPERSON</th>
                <th>LEADS</th>
                <th>DEALS</th>
                <th>WON</th>
              </tr>
            </thead>
            <tbody>
              {stats.performanceData.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontWeight: '600', color: '#111827' }}>{row.salesperson}</td>
                  <td>{row.leads}</td>
                  <td>{row.deals}</td>
                  <td>{row.won}</td>
                </tr>
              ))}
              {stats.performanceData.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No salespersons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Deals by Month Chart */}
      <div className="manager-card">
        <h2 className="manager-card-title">Team Deals by Month</h2>
        <div style={{ marginTop: '1.5rem', paddingBottom: '1rem', height: '300px' }}>
          <MonthlyDealsChart data={stats.monthlyData.length > 0 ? stats.monthlyData : [
            { month: 'Jan', deals: 0 }, { month: 'Feb', deals: 0 }, { month: 'Mar', deals: 0 },
            { month: 'Apr', deals: 0 }, { month: 'May', deals: 0 }, { month: 'Jun', deals: 0 },
            { month: 'Jul', deals: 0 }, { month: 'Aug', deals: 0 }, { month: 'Sep', deals: 0 },
            { month: 'Oct', deals: 0 }, { month: 'Nov', deals: 0 }, { month: 'Dec', deals: 0 }
          ]} />
        </div>
      </div>

    </div>
  );
};

export default ManagerReports;
