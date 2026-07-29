import React, { useState, useEffect } from 'react';
import { Target, Briefcase, Clock, CheckCircle } from 'lucide-react';

const SalesOverview = () => {
  const [dashboardData, setDashboardData] = useState({
    myLeads: 0,
    openDeals: 0,
    dealsWon: 0,
    openTasks: 0,
    activities: [],
    todayTasks: []
  });

  useEffect(() => {
    const fetchOverviewData = async () => {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      try {
        const [usersRes, leadsRes, dealsRes, tasksRes] = await Promise.all([
          fetch('/api/users', { headers }),
          fetch('/api/leads', { headers }),
          fetch('/api/deals', { headers }),
          fetch('/api/tasks', { headers })
        ]);

        if (usersRes.ok && leadsRes.ok && dealsRes.ok && tasksRes.ok) {
          const users = await usersRes.json();
          const leads = await leadsRes.json();
          const deals = await dealsRes.json();
          const tasks = await tasksRes.json();
          
          const loggedInUserStr = localStorage.getItem('user');
          const loggedInUserSession = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;
          
          const salesUser = users.find(u => u.email === loggedInUserSession?.email);
          const salesName = salesUser?.name || loggedInUserSession?.name;

          const myLeadsData = leads.filter(l => l.assignedSalesperson === salesName);
          
          const enrichedDeals = deals.map(d => {
            const associatedLead = leads.find(l => l.name === d.contact);
            return {
              ...d,
              salesPerson: associatedLead && associatedLead.assignedSalesperson ? associatedLead.assignedSalesperson : (d.salesPerson || 'Unassigned')
            };
          });
          const myDeals = enrichedDeals.filter(d => d.salesPerson === salesName);
          
          const myTasks = tasks.filter(t => t.assignedTo === salesName);

          const myLeads = myLeadsData.length;
          const dealsWon = myDeals.filter(d => d.stage?.toLowerCase() === 'won').length;
          const openDeals = myDeals.length - dealsWon - myDeals.filter(d => d.stage?.toLowerCase() === 'lost').length;
          const openTasksList = myTasks.filter(t => t.status !== 'Done');
          const openTasksCount = openTasksList.length;

          const recentLeads = [...myLeadsData].reverse().slice(0, 4);
          const activities = recentLeads.map(lead => ({
            id: lead.id,
            text: <>You were assigned to Lead <strong>{lead.name}</strong></>,
            meta: `${lead.source || 'Direct'} • ${lead.status || 'New'}`
          }));

          setDashboardData({
            myLeads,
            openDeals,
            dealsWon,
            openTasks: openTasksCount,
            activities,
            todayTasks: openTasksList.slice(0, 4)
          });
        }
      } catch (err) {
        console.error("Error fetching overview data", err);
      }
    };

    fetchOverviewData();
  }, []);

  const stats = [
    { label: 'MY LEADS', value: dashboardData.myLeads, icon: <Target size={18} color="#ef4444" />, iconBg: '#fee2e2' },
    { label: 'OPEN DEALS', value: dashboardData.openDeals, icon: <Briefcase size={18} color="#a855f7" />, iconBg: '#f3e8ff' },
    { label: 'TASKS DUE TODAY', value: dashboardData.openTasks, icon: <Clock size={18} color="#f97316" />, iconBg: '#ffedd5' },
    { label: 'DEALS WON', value: dashboardData.dealsWon, icon: <CheckCircle size={18} color="#22c55e" />, iconBg: '#dcfce7' },
  ];

  return (
    <div className="sales-overview-container">
      {/* Stats Grid */}
      <div className="sales-stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="sales-stat-card">
              <div 
                className="sales-stat-icon-wrapper" 
                style={{ backgroundColor: stat.iconBg, display: 'inline-flex', width: '32px', height: '32px', borderRadius: '6px', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginBottom: '1rem' }}
              >
                {stat.icon}
              </div>
              <h3 style={{ fontSize: '0.65rem', color: '#94a3b8', margin: '0 0 0.5rem 0', fontWeight: '700', letterSpacing: '0.05em' }}>{stat.label}</h3>
              <p className="stat-value" style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
        {/* Today's Tasks */}
        <div className="sales-activity-section" style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Today's Tasks</h3>
          {dashboardData.todayTasks.length > 0 ? (
            <div className="sales-activity-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {dashboardData.todayTasks.map((task, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', paddingBottom: '1rem', borderBottom: idx !== dashboardData.todayTasks.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: task.priority?.toLowerCase() === 'high' ? '#ef4444' : task.priority?.toLowerCase() === 'medium' ? '#f97316' : '#3b82f6', marginTop: '6px' }}></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontWeight: '600', fontSize: '0.9rem', color: '#1e293b' }}>{task.title}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{task.type ? task.type + ' ' : ''}{task.dueDate || 'No Date'}</span>
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 'bold' }}>{task.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No tasks due today 🎉</p>
          )}
        </div>

        {/* Recent Leads */}
        <div className="sales-activity-section" style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Recent Leads</h3>
          <div className="sales-activity-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {dashboardData.activities.map((activity) => {
              // Extract status text from meta string or assume defaults based on the image
              let statusText = activity.meta.split('•')[1]?.trim() || 'NEW';
              let badgeBg = '#dbeafe';
              let badgeColor = '#3b82f6';
              if (statusText.toLowerCase() === 'not interested') {
                badgeBg = '#fee2e2'; badgeColor = '#ef4444';
              } else if (statusText.toLowerCase() === 'contacted') {
                badgeBg = '#f3e8ff'; badgeColor = '#a855f7';
              }
              
              return (
                <div key={activity.id} className="sales-activity-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div className="sales-activity-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6', marginTop: '6px' }}></div>
                  <div className="sales-activity-content">
                    <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', fontSize: '0.9rem' }}>{activity.text.props.children[2]}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                      <span>{activity.meta.split('•')[0].trim()}</span>
                      <span style={{ backgroundColor: badgeBg, color: badgeColor, padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.65rem' }}>
                        {statusText.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {dashboardData.activities.length === 0 && (
              <p style={{ color: '#64748b' }}>No recent leads to show.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;
