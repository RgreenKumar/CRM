import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldCheck, Lightbulb, Contact, Handshake, ClipboardList, BarChart2, Settings, LogOut } from 'lucide-react';

import DashboardOverview from './dashboard/DashboardOverview';
import UserManagement from './dashboard/UserManagement';
import RolesPermissions from './dashboard/RolesPermissions';
import LeadsManagement from './dashboard/LeadsManagement';
import ContactManagement from './dashboard/ContactManagement';
import DealsManagement from './dashboard/DealsManagement';
import TaskManagement from './dashboard/TaskManagement';
import ReportAnalysis from './dashboard/ReportAnalysis';
import AppSettings from './dashboard/AppSettings';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userStr = localStorage.getItem('user');
  const loggedInUser = userStr ? JSON.parse(userStr) : null;
  const displayName = loggedInUser?.name || 'Admin User';
  const displayEmail = loggedInUser?.email || 'admin@example.com';
  const displayRole = loggedInUser?.role === 'ROLE_ADMIN' ? 'Administrator' :
                      loggedInUser?.role === 'ROLE_MANAGER' ? 'Manager' :
                      loggedInUser?.role === 'ROLE_SALES' ? 'Sales Person' :
                      (loggedInUser?.role || 'Administrator');
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'ROLE_ADMIN', status: 'Active' },
    { id: 2, name: 'Sarah Smith', email: 'sarah.smith@example.com', role: 'ROLE_MANAGER', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', role: 'ROLE_SALES', status: 'Active' },
    { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', role: 'ROLE_SALES', status: 'Inactive' },
    { id: 5, name: 'David Brown', email: 'david.brown@example.com', role: 'ROLE_SALES', status: 'Active' }
  ]);
  const [leads, setLeads] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    // Fetch all entities from backend
    Promise.all([
      fetch('/api/users', { headers }).then(res => res.json()),
      fetch('/api/leads', { headers }).then(res => res.json()),
      fetch('/api/contacts', { headers }).then(res => res.json()),
      fetch('/api/deals', { headers }).then(res => res.json()),
      fetch('/api/tasks', { headers }).then(res => res.json())
    ]).then(([usersData, leadsData, contactsData, dealsData, tasksData]) => {
      // Map the logged-in user to the top of the users array if needed, or just let DB data govern
      if (Array.isArray(usersData)) {
        // Ensure the logged in user is at the top
        const others = usersData.filter(u => u.email !== displayEmail);
        const self = usersData.find(u => u.email === displayEmail);
        setUsers(self ? [self, ...others] : usersData);
      }
      if (Array.isArray(leadsData)) setLeads(leadsData);
      if (Array.isArray(contactsData)) setContacts(contactsData);
      if (Array.isArray(dealsData)) setDeals(dealsData);
      if (Array.isArray(tasksData)) setTasks(tasksData);
    }).catch(err => console.error("Error fetching data", err));
  }, [displayEmail]);

  const handleSetLeads = (newLeads) => {
    // If leads are being deleted (new array is smaller)
    if (newLeads.length < leads.length) {
      const deletedLeads = leads.filter(l => !newLeads.find(nl => nl.id === l.id));
      deletedLeads.forEach(deletedLead => {
        setContacts(prev => prev.filter(c => c.name !== deletedLead.name));
        setDeals(prev => prev.filter(d => d.contact !== deletedLead.name));
      });
    }
    setLeads(newLeads);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/users', label: 'User Management', icon: Users },
    { path: '/dashboard/roles', label: 'Roles & Permissions', icon: ShieldCheck },
    { path: '/dashboard/leads', label: 'Leads Management', icon: Lightbulb },
    { path: '/dashboard/contacts', label: 'Contact Management', icon: Contact },
    { path: '/dashboard/deals', label: 'Deals Management', icon: Handshake },
    { path: '/dashboard/tasks', label: 'Task Management', icon: ClipboardList },
    { path: '/dashboard/reports', label: 'Reports & Analysis', icon: BarChart2 },
    { path: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const currentNavItem = navItems.find(item => location.pathname === item.path) || navItems[0];

  const displayHeaderRole = displayRole;
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>C</div>
          <h1>CRM<span>ADMIN</span></h1>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <span style={{ fontSize: '1.25rem', display: 'flex' }}><Icon size={20} /></span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <span style={{ fontSize: '1.25rem', display: 'flex' }}><LogOut size={20} /></span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>{currentNavItem.label}</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>{avatarLetter}</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{displayName}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{displayHeaderRole}</span>
            </div>
          </div>
        </header>

        <div className="content-area">
          <Routes>
            <Route path="/" element={<DashboardOverview users={users} leads={leads} deals={deals} />} />
            <Route path="/users" element={<UserManagement users={users} setUsers={setUsers} leads={leads} setLeads={handleSetLeads} tasks={tasks} setTasks={setTasks} />} />
            <Route path="/roles" element={<RolesPermissions />} />
            <Route path="/leads" element={<LeadsManagement leads={leads} setLeads={handleSetLeads} users={users} />} />
            <Route path="/contacts" element={<ContactManagement contacts={contacts} setContacts={setContacts} leads={leads} setLeads={handleSetLeads} />} />
            <Route path="/deals" element={<DealsManagement deals={deals} setDeals={setDeals} contacts={contacts} users={users} />} />
            <Route path="/tasks" element={<TaskManagement tasks={tasks} setTasks={setTasks} users={users} />} />
            <Route path="/reports" element={<ReportAnalysis users={users} leads={leads} deals={deals} />} />
            <Route path="/settings" element={<AppSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
