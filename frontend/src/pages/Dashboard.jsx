import { useState } from 'react';
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

  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Sarah Smith', email: 'sarah.smith@example.com', role: 'Sales Manager', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', role: 'Sales User', status: 'Active' },
    { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', role: 'Sales User', status: 'Inactive' },
    { id: 5, name: 'David Brown', email: 'david.brown@example.com', role: 'Sales User', status: 'Active' },
  ]);

  const [leads, setLeads] = useState([
    { id: 1, name: 'Rahul Kumar', email: 'rahul@tech.com', phone: '9876543210', source: 'Website', status: 'New', assignedTo: 'Sam Sales' },
    { id: 2, name: 'Sophia Lee', email: 'sophia@startup.io', phone: '9123456789', source: 'Referral', status: 'Contacted', assignedTo: 'Sam Sales' },
    { id: 3, name: 'Mark Evans', email: 'mark@bigcorp.com', phone: '9988776655', source: 'Cold Call', status: 'Interested', assignedTo: 'Jake Johnson' },
    { id: 4, name: 'Nisha Reddy', email: 'nisha@enterprise.in', phone: '8877665544', source: 'Social Media', status: 'Qualified', assignedTo: 'Priya Patel' },
    { id: 5, name: 'Tom Wright', email: 'tom@solutions.net', phone: '7766554433', source: 'Website', status: 'Not Interested', assignedTo: 'Jake Johnson' }
  ]);

  const [contacts, setContacts] = useState([
    { id: 1, name: 'Rahul Kumar', email: 'rahul@tech.com', phone: '9876543210', company: 'Tech Solutions Pvt Ltd', designation: 'CTO' },
    { id: 2, name: 'Sophia Lee', email: 'sophia@startup.io', phone: '9123456789', company: 'StartupIO', designation: 'CEO' },
    { id: 3, name: 'Nisha Reddy', email: 'nisha@enterprise.in', phone: '8877665544', company: 'Enterprise India', designation: 'Procurement Head' }
  ]);

  const [deals, setDeals] = useState([
    { id: 1, title: 'Tech Solutions ERP Deal', contact: 'Rahul Kumar', value: '1,50,000', stage: 'Won', closeDate: '2026-05-30' },
    { id: 2, title: 'StartupIO SaaS Package', contact: 'Amit Singh', value: '80,000', stage: 'Negotiation', closeDate: '2026-07-15' },
    { id: 3, title: 'Enterprise India Contract', contact: 'Nisha Reddy', value: '2,20,000', stage: 'Proposal', closeDate: '2026-08-01' }
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Follow up with Rahul', assignedTo: 'Sam Sales', dueDate: '2026-06-20', priority: 'High', status: 'Pending' },
    { id: 2, title: 'Send proposal to Sophia', assignedTo: 'Sam Sales', dueDate: '2026-06-18', priority: 'Medium', status: 'In Progress' },
    { id: 3, title: 'Demo call with Mark', assignedTo: 'Jake Johnson', dueDate: '2026-06-22', priority: 'High', status: 'Pending' },
    { id: 4, title: 'Contract review Nisha', assignedTo: 'Priya Patel', dueDate: '2026-06-25', priority: 'Low', status: 'Done' },
    { id: 5, title: 'send proposal to rahul', assignedTo: 'Balaji', dueDate: '2026-06-22', priority: 'Medium', status: 'Pending' }
  ]);

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
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>A</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Admin User</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Administrator</span>
            </div>
          </div>
        </header>

        <div className="content-area">
          <Routes>
            <Route path="/" element={<DashboardOverview users={users} leads={leads} deals={deals} />} />
            <Route path="/users" element={<UserManagement users={users} setUsers={setUsers} />} />
            <Route path="/roles" element={<RolesPermissions />} />
            <Route path="/leads" element={<LeadsManagement leads={leads} setLeads={handleSetLeads} />} />
            <Route path="/contacts" element={<ContactManagement contacts={contacts} setContacts={setContacts} />} />
            <Route path="/deals" element={<DealsManagement deals={deals} setDeals={setDeals} contacts={contacts} />} />
            <Route path="/tasks" element={<TaskManagement tasks={tasks} setTasks={setTasks} users={users} />} />
            <Route path="/reports" element={<ReportAnalysis leads={leads} deals={deals} />} />
            <Route path="/settings" element={<AppSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
