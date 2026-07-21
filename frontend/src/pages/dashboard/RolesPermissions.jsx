import React, { useState } from 'react';

const RolesPermissions = () => {
  const [permissions, setPermissions] = useState([
    { id: 1, name: 'View Leads', manager: true, salesperson: true },
    { id: 2, name: 'Assign Leads', manager: true, salesperson: false },
    { id: 3, name: 'View Deals', manager: true, salesperson: true },
    { id: 4, name: 'View Reports', manager: true, salesperson: false },
    { id: 5, name: 'Manage Users', manager: false, salesperson: false },
  ]);

  const togglePermission = (id, role) => {
    setPermissions(permissions.map(p => 
      p.id === id ? { ...p, [role]: !p[role] } : p
    ));
  };

  return (
    <div>
      <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#1f2937', fontWeight: '600' }}>Role Permissions</h3>
          <span style={{ color: '#9ca3af', fontSize: '13px' }}>Save the Changes</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', color: '#6b7280', fontSize: '11px', fontWeight: '600', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>PERMISSION</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>MANAGER</th>
              <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>SALESPERSON</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px 24px', color: '#374151', fontSize: '14px', fontWeight: '500' }}>{p.name}</td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={p.manager} 
                    onChange={() => togglePermission(p.id, 'manager')}
                    style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#3b82f6' }}
                  />
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={p.salesperson} 
                    onChange={() => togglePermission(p.id, 'salesperson')}
                    style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#3b82f6' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#fff' }}>
          <button style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)' }}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default RolesPermissions;
