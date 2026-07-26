import React, { useState, useEffect } from 'react';
import { Users, Target, Briefcase, CheckCircle } from 'lucide-react';

const ManagerOverview = () => {
  const [dashboardData, setDashboardData] = useState({
    teamMembers: 0,
    teamLeads: 0,
    openDeals: 0,
    dealsWon: 0,
    activities: []
  });

  useEffect(() => {
    const fetchOverviewData = async () => {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

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

          const teamMembersList = users.filter(u => 
            (u.role === 'ROLE_USER' || u.role === 'ROLE_SALES' || u.role === 'Sales Person') && 
            u.manager === managerName
          );
          const teamMemberNames = teamMembersList.map(u => u.name);

          const managerLeads = leads.filter(l => !l.assignedTo || l.assignedTo === 'Unassigned' || teamMemberNames.includes(l.assignedTo) || l.assignedTo === managerName);
          const managerDeals = deals.filter(d => teamMemberNames.includes(d.assignedTo) || d.assignedTo === managerName);

          const teamMembers = teamMembersList.length;
          const teamLeads = managerLeads.length;
          const dealsWon = managerDeals.filter(d => d.stage?.toLowerCase() === 'won').length;
          const openDeals = managerDeals.length - dealsWon - managerDeals.filter(d => d.stage?.toLowerCase() === 'lost').length;

          // Map the latest 5 leads as recent activity
          const recentLeads = [...managerLeads].reverse().slice(0, 5);
          const activities = recentLeads.map(lead => ({
            id: lead.id,
            text: <>Lead <strong>{lead.name}</strong> assigned to <strong>{lead.assignedTo || 'Unassigned'}</strong></>,
            meta: `${lead.source || 'Direct'} • ${lead.status || 'New'}`
          }));

          setDashboardData({
            teamMembers,
            teamLeads,
            openDeals,
            dealsWon,
            activities
          });
        }
      } catch (err) {
        console.error("Error fetching overview data", err);
      }
    };

    fetchOverviewData();
  }, []);

  const stats = [
    { label: 'TEAM MEMBERS', value: dashboardData.teamMembers, icon: Users, iconColor: '#6366f1', iconBg: '#e0e7ff' },
    { label: 'TEAM LEADS', value: dashboardData.teamLeads, icon: Target, iconColor: '#ef4444', iconBg: '#fee2e2' },
    { label: 'OPEN DEALS', value: dashboardData.openDeals, icon: Briefcase, iconColor: '#a855f7', iconBg: '#f3e8ff' },
    { label: 'DEALS WON', value: dashboardData.dealsWon, icon: CheckCircle, iconColor: '#22c55e', iconBg: '#dcfce7' },
  ];

  return (
    <div className="manager-overview-container">
      {/* Stats Grid */}
      <div className="manager-stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="manager-stat-card">
              <div 
                className="manager-stat-icon-wrapper" 
                style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}
              >
                <Icon size={20} />
              </div>
              <h3>{stat.label}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Team Activity */}
      <div className="manager-activity-section">
        <h3>Recent Team Activity</h3>
        <div className="manager-activity-list">
          {dashboardData.activities.map((activity) => (
            <div key={activity.id} className="manager-activity-item">
              <div className="manager-activity-dot"></div>
              <div className="manager-activity-content">
                <p>{activity.text}</p>
                <p className="manager-activity-meta">{activity.meta}</p>
              </div>
            </div>
          ))}
          {dashboardData.activities.length === 0 && (
            <p style={{ color: '#64748b' }}>No recent activity to show.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerOverview;
