import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Mail, Webhook, Plus } from 'lucide-react';

const AppSettings = () => {
  const [activeTab, setActiveTab] = useState('pipeline');
  const { 
    pipelineStages, 
    addPipelineStage, updatePipelineStage, deletePipelineStage,
    companyName, setCompanyName,
    timeZone, setTimeZone,
    dateFormat, setDateFormat,
    currency, setCurrency 
  } = useSettings();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentStageName, setCurrentStageName] = useState('');
  const [currentStageColor, setCurrentStageColor] = useState('#3b82f6');
  const [editId, setEditId] = useState(null);

  const handleAddStage = () => {
    setModalType('add');
    setCurrentStageName('');
    setCurrentStageColor('#3b82f6');
    setIsModalOpen(true);
  };

  const handleEditStage = (stage) => {
    setModalType('edit');
    setCurrentStageName(stage.name);
    setCurrentStageColor(stage.color || '#3b82f6');
    setEditId(stage.id);
    setIsModalOpen(true);
  };

  const handleSaveStage = () => {
    if (currentStageName.trim() === "") return;

    if (modalType === 'add') {
      addPipelineStage({ 
        name: currentStageName.trim(), 
        color: currentStageColor,
        sortOrder: pipelineStages.length 
      });
    } else if (modalType === 'edit' && editId !== null) {
      updatePipelineStage(editId, { 
        name: currentStageName.trim(), 
        color: currentStageColor 
      });
    }
    setIsModalOpen(false);
  };

  const handleDeleteStage = (stage) => {
    if (confirm(`Are you sure you want to delete the stage "${stage.name}"?`)) {
      deletePipelineStage(stage.id);
    }
  };

  const handleCurrencyChange = (e) => {
    const val = e.target.value;
    if (val === 'USD') setCurrency({ label: 'USD - US Dollar', symbol: '$' });
    else if (val === 'INR') setCurrency({ label: 'INR - Indian Rupee', symbol: '₹' });
    else if (val === 'EUR') setCurrency({ label: 'EUR - Euro', symbol: '€' });
    else if (val === 'GBP') setCurrency({ label: 'GBP - British Pound', symbol: '£' });
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 2px' }}>Settings</h2>
        <p style={{ color: '#6b7280', margin: 0, fontSize: '13px' }}>Configure your CRM system</p>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        <button 
          onClick={() => setActiveTab('pipeline')}
          style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: activeTab === 'pipeline' ? '#ffffff' : 'transparent', color: activeTab === 'pipeline' ? '#111827' : '#6b7280', fontWeight: activeTab === 'pipeline' ? '600' : '500', boxShadow: activeTab === 'pipeline' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', fontSize: '13px' }}
        >
          Pipeline Configuration
        </button>
        <button 
          onClick={() => setActiveTab('integrations')}
          style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'integrations' ? '1px solid #e5e7eb' : 'none', backgroundColor: activeTab === 'integrations' ? '#ffffff' : 'transparent', color: activeTab === 'integrations' ? '#111827' : '#6b7280', fontWeight: activeTab === 'integrations' ? '600' : '500', boxShadow: activeTab === 'integrations' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', fontSize: '13px' }}
        >
          Email / API Integrations
        </button>
        <button 
          onClick={() => setActiveTab('system')}
          style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'system' ? '1px solid #e5e7eb' : 'none', backgroundColor: activeTab === 'system' ? '#ffffff' : 'transparent', color: activeTab === 'system' ? '#111827' : '#6b7280', fontWeight: activeTab === 'system' ? '600' : '500', boxShadow: activeTab === 'system' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', fontSize: '13px' }}
        >
          System Settings
        </button>
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        
        {activeTab === 'pipeline' && (
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Pipeline Stages</h3>
              <button 
                onClick={handleAddStage}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
              >
                <Plus size={14} /> Add Stage
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pipelineStages.map((stage, index) => (
                <div key={stage.id || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: stage.color || '#e5e7eb' }}></div>
                    <span style={{ fontWeight: '500', fontSize: '14px' }}>{index + 1}. {stage.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      onClick={() => handleEditStage(stage)}
                      style={{ padding: '4px 10px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteStage(stage)}
                      style={{ padding: '4px 10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={18} style={{ color: '#9ca3af' }} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Email Integration</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Connect your email account</p>
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ margin: '0 0 2px', fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Connected Account</p>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: '500' }}>admin@yourcompany.com</p>
              </div>
              <button style={{ marginTop: 'auto', backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                Configure
              </button>
            </div>

            <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#faf5ff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Webhook size={18} style={{ color: '#a855f7' }} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>API Integration</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Connect external services</p>
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ margin: '0 0 2px', fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>API Endpoint</p>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: '500' }}>https://api.yourservice.com</p>
              </div>
              <button style={{ marginTop: 'auto', backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                Configure
              </button>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Company Name</label>
              <input 
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Time Zone</label>
                <select 
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', backgroundColor: 'white', boxSizing: 'border-box' }}
                >
                  <option value="UTC+5:30 (India)">UTC+5:30 (India)</option>
                  <option value="UTC-5:00 (EST)">UTC-5:00 (EST)</option>
                  <option value="UTC+0:00 (GMT)">UTC+0:00 (GMT)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Date Format</label>
                <select 
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', backgroundColor: 'white', boxSizing: 'border-box' }}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>

            <div style={{ width: 'calc(50% - 8px)' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Currency</label>
              <select 
                value={currency.label.split(' ')[0]} 
                onChange={handleCurrencyChange}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', backgroundColor: 'white', boxSizing: 'border-box' }}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                {modalType === 'add' ? 'Add Pipeline Stage' : 'Edit Pipeline Stage'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </div>
            
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Stage Name</label>
                <input 
                  type="text" 
                  value={currentStageName} 
                  onChange={(e) => setCurrentStageName(e.target.value)}
                  placeholder="e.g. Negotiation"
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  autoFocus
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Stage Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input 
                    type="color" 
                    value={currentStageColor} 
                    onChange={(e) => setCurrentStageColor(e.target.value)}
                    style={{ width: '40px', height: '40px', padding: '0', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', color: '#6b7280', fontFamily: 'monospace' }}>{currentStageColor}</span>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'flex-end', gap: '10px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', backgroundColor: '#f9fafb' }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', color: '#374151' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveStage}
                style={{ padding: '8px 16px', backgroundColor: '#3b82f6', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', color: 'white' }}
              >
                {modalType === 'add' ? 'Add Stage' : 'Update Stage'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AppSettings;
