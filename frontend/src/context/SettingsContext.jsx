import React, { createContext, useState, useContext, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  return useContext(SettingsContext);
};

export const SettingsProvider = ({ children }) => {
  const [currency, setCurrency] = useState({ label: 'USD - US Dollar', symbol: '$' });
  const [pipelineStages, setPipelineStagesState] = useState([]);
  const [companyName, setCompanyName] = useState('Your Company');
  const [timeZone, setTimeZone] = useState('UTC+5:30 (India)');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

  // Fetch stages from backend on load
  useEffect(() => {
    fetch('http://localhost:8080/api/stages')
      .then(res => res.json())
      .then(data => {
        setPipelineStagesState(data);
      })
      .catch(err => console.error("Failed to fetch pipeline stages:", err));
  }, []);

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
    setDateFormat
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
