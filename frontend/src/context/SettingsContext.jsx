import React, { createContext, useState, useContext, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  return useContext(SettingsContext);
};

export const SettingsProvider = ({ children }) => {
  const [currency, setCurrency] = useState({ label: 'INR - Indian Rupee', symbol: '₹' });
  const [pipelineStages, setPipelineStagesState] = useState([]);
  const [companyName, setCompanyName] = useState('Your Company');
  const [timeZone, setTimeZone] = useState('UTC+5:30 (India)');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [rolePermissions, setRolePermissions] = useState(null);

  // Fetch settings from backend on load
  useEffect(() => {
    // Fetch pipeline stages
    fetch('http://localhost:8080/api/stages')
      .then(res => res.json())
      .then(data => {
        // Enforce defaults based on name for existing data
        const enrichedData = data.map(stage => {
          if (stage.name.toLowerCase().includes('won')) return { ...stage, status: 'Won' };
          if (stage.name.toLowerCase().includes('lost')) return { ...stage, status: 'Lost' };
          return { ...stage, status: stage.status || 'Open' };
        });
        setPipelineStagesState(enrichedData);
      })
      .catch(err => console.error("Failed to fetch pipeline stages:", err));

    // Fetch system settings
    fetch('http://localhost:8080/api/settings/get/companyName')
      .then(res => res.json())
      .then(data => setCompanyName(data.settingValue))
      .catch(err => console.error("Failed to fetch company name:", err));

    fetch('http://localhost:8080/api/settings/get/timeZone')
      .then(res => res.json())
      .then(data => setTimeZone(data.settingValue))
      .catch(err => console.error("Failed to fetch timeZone:", err));

    fetch('http://localhost:8080/api/settings/get/dateFormat')
      .then(res => res.json())
      .then(data => setDateFormat(data.settingValue))
      .catch(err => console.error("Failed to fetch dateFormat:", err));

    fetch('http://localhost:8080/api/settings/get/currency')
      .then(res => res.json())
      .then(data => setCurrency(JSON.parse(data.settingValue)))
      .catch(err => console.error("Failed to fetch currency:", err));

    // Fetch role permissions
    fetch('http://localhost:8080/api/settings/get/role_permissions')
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        try {
          const parsed = JSON.parse(data.settingValue);
          if (!parsed.find(p => p.name === 'Task Management')) {
            parsed.push({ id: 6, name: 'Task Management', manager: true, salesperson: false });
          }
          setRolePermissions(parsed);
        } catch(e) {
          console.error("Failed to parse role_permissions", e);
        }
      })
      .catch(err => {
        console.error("Failed to fetch role_permissions, using defaults:", err);
        setRolePermissions([
          { id: 1, name: 'View Leads', manager: true, salesperson: true },
          { id: 2, name: 'Assign Leads', manager: true, salesperson: false },
          { id: 3, name: 'View Deals', manager: true, salesperson: true },
          { id: 4, name: 'View Reports', manager: true, salesperson: false },
          { id: 5, name: 'Manage Users', manager: false, salesperson: false },
          { id: 6, name: 'Task Management', manager: true, salesperson: false },
        ]);
      });
  }, []);

  const updateSettingInDb = async (key, value) => {
    try {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
      const response = await fetch('http://localhost:8080/api/settings/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ settingKey: key, settingValue: stringValue })
      });
      if (response.ok) {
        console.log(`${key} successfully updated in DB.`);
      }
    } catch (err) {
      console.error(`Failed to update ${key} in DB:`, err);
    }
  };

  const addPipelineStage = async (stageData) => {
    try {
      const response = await fetch('http://localhost:8080/api/stages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stageData)
      });
      const newStage = await response.json();
      setPipelineStagesState([...pipelineStages, newStage]);
    } catch (err) {
      console.error("Failed to add stage:", err);
    }
  };

  const updatePipelineStage = async (id, stageData) => {
    try {
      const response = await fetch(`http://localhost:8080/api/stages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stageData)
      });
      const updatedStage = await response.json();
      setPipelineStagesState(pipelineStages.map(s => s.id === id ? updatedStage : s));
    } catch (err) {
      console.error("Failed to update stage:", err);
    }
  };

  const deletePipelineStage = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/stages/${id}`, {
        method: 'DELETE'
      });
      setPipelineStagesState(pipelineStages.filter(s => s.id !== id));
    } catch (err) {
      console.error("Failed to delete stage:", err);
    }
  };

  const [emailIntegration, setEmailIntegration] = useState({
    email: 'admin@yourcompany.com',
    provider: 'SMTP',
    password: '',
    connected: true
  });
  const [apiIntegration, setApiIntegration] = useState({
    endpoint: 'https://api.yourservice.com',
    apiKey: '',
    connected: true
  });

  const value = {
    currency,
    setCurrency,
    pipelineStages,
    addPipelineStage,
    updatePipelineStage,
    deletePipelineStage,
    companyName,
    setCompanyName,
    timeZone,
    setTimeZone,
    dateFormat,
    setDateFormat,
    updateSettingInDb,
    emailIntegration,
    setEmailIntegration,
    apiIntegration,
    setApiIntegration,
    rolePermissions,
    setRolePermissions
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
