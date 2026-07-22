import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Mail, Webhook, Plus, CheckCircle, XCircle, Key, Server, Lock, Building, Clock, Calendar, DollarSign } from 'lucide-react';

const AppSettings = () => {
  const [activeTab, setActiveTab] = useState('pipeline');
  const { 
    pipelineStages, 
    addPipelineStage, updatePipelineStage, deletePipelineStage,
    companyName, setCompanyName,
    timeZone, setTimeZone,
    dateFormat, setDateFormat,
    currency, setCurrency,
    emailIntegration, setEmailIntegration,
    apiIntegration, setApiIntegration
  } = useSettings();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentStageName, setCurrentStageName] = useState('');
  const [currentStageColor, setCurrentStageColor] = useState('#3b82f6');
  const [currentStageStatus, setCurrentStageStatus] = useState('Open');
  const [editId, setEditId] = useState(null);

  // Integration Modal State
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
  const [integrationType, setIntegrationType] = useState('email'); // 'email' or 'api'
  const [integrationForm, setIntegrationForm] = useState({});

  const handleOpenIntegrationModal = (type) => {
    setIntegrationType(type);
    if (type === 'email') {
      setIntegrationForm({ ...emailIntegration, password: '' });
    } else {
      setIntegrationForm({ ...apiIntegration, apiKey: '' });
    }
    setIsIntegrationModalOpen(true);
  };

  const handleSaveIntegration = () => {
    if (integrationType === 'email') {
      setEmailIntegration({ ...integrationForm, connected: true });
    } else {
      setApiIntegration({ ...integrationForm, connected: true });
    }
    setIsIntegrationModalOpen(false);
  };

  const handleAddStage = () => {
    setModalType('add');
    setCurrentStageName('');
    setCurrentStageColor('#3b82f6');
    setCurrentStageStatus('Open');
    setIsModalOpen(true);
  };

  const handleEditStage = (stage) => {
    setModalType('edit');
    setCurrentStageName(stage.name);
    setCurrentStageColor(stage.color || '#3b82f6');
    if (stage.name.toLowerCase().includes('won')) {
      setCurrentStageStatus('Won');
    } else {
      setCurrentStageStatus(stage.status || 'Open');
    }
    setEditId(stage.id);
    setIsModalOpen(true);
  };

  const handleSaveStage = () => {
    if (currentStageName.trim() === "") return;

    if (modalType === 'add') {
      addPipelineStage({ 
        name: currentStageName.trim(), 
        color: currentStageColor,
        status: currentStageStatus,
        sortOrder: pipelineStages.length 
      });
    } else if (modalType === 'edit' && editId !== null) {
      updatePipelineStage(editId, { 
        name: currentStageName.trim(), 
        color: currentStageColor,
        status: currentStageStatus
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
          <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', backgroundColor: '#f8fafc', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
            {/* Email Integration Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', border: '1px solid #e2e8f0', transition: 'all 0.2s ease', cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail size={22} style={{ color: '#3b82f6' }} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>Email Integration</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {emailIntegration?.connected ? <CheckCircle size={14} color="#10b981" /> : <XCircle size={14} color="#ef4444" />}
                      <span style={{ fontSize: '13px', color: emailIntegration?.connected ? '#10b981' : '#ef4444', fontWeight: '500' }}>
                        {emailIntegration?.connected ? 'Connected' : 'Not Connected'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: '24px', backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em' }}>Connected Account</p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#334155' }}>{emailIntegration?.email || 'None'}</p>
              </div>
              <button 
                onClick={() => handleOpenIntegrationModal('email')}
                style={{ marginTop: 'auto', width: '100%', backgroundColor: 'white', color: '#3b82f6', border: '1px solid #bfdbfe', padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
              >
                Configure Email
              </button>
            </div>

            {/* API Integration Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', border: '1px solid #e2e8f0', transition: 'all 0.2s ease', cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: '#faf5ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Webhook size={22} style={{ color: '#a855f7' }} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>API Integration</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {apiIntegration?.connected ? <CheckCircle size={14} color="#10b981" /> : <XCircle size={14} color="#ef4444" />}
                      <span style={{ fontSize: '13px', color: apiIntegration?.connected ? '#10b981' : '#ef4444', fontWeight: '500' }}>
                        {apiIntegration?.connected ? 'Connected' : 'Not Connected'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: '24px', backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em' }}>API Endpoint</p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#334155', wordBreak: 'break-all' }}>{apiIntegration?.endpoint || 'None'}</p>
              </div>
              <button 
                onClick={() => handleOpenIntegrationModal('api')}
                style={{ marginTop: 'auto', width: '100%', backgroundColor: 'white', color: '#a855f7', border: '1px solid #e9d5ff', padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#faf5ff'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
              >
                Configure API
              </button>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>General Preferences</h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Manage your basic company and localization settings here.</p>
              </div>

              <div style={{ height: '1px', backgroundColor: '#e2e8f0', width: '100%' }}></div>

              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '16px', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                    <Building size={14} color="#64748b" /> Company Name
                  </label>
                </div>
                <div>
                  <input 
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter your company name"
                    style={{ width: '100%', maxWidth: '300px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: '#e2e8f0', width: '100%' }}></div>

              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '16px', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                    <Clock size={14} color="#64748b" /> Regional Settings
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '12px', maxWidth: '300px' }}>
                  <div style={{ flex: 1 }}>
                    <select 
                      value={timeZone}
                      onChange={(e) => setTimeZone(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', color: '#0f172a', backgroundColor: 'white', boxSizing: 'border-box', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="UTC+5:30 (India)">UTC+5:30</option>
                      <option value="UTC-5:00 (EST)">UTC-5:00</option>
                      <option value="UTC+0:00 (GMT)">UTC+0:00</option>
                      <option value="UTC+1:00 (CET)">UTC+1:00</option>
                      <option value="UTC-8:00 (PST)">UTC-8:00</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <select 
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', color: '#0f172a', backgroundColor: 'white', boxSizing: 'border-box', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: '#e2e8f0', width: '100%' }}></div>

              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '16px', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                    <DollarSign size={14} color="#64748b" /> Primary Currency
                  </label>
                </div>
                <div>
                  <select 
                    value={currency.label.split(' ')[0]} 
                    onChange={handleCurrencyChange}
                    style={{ width: '100%', maxWidth: '300px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', color: '#0f172a', backgroundColor: 'white', boxSizing: 'border-box', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="USD">USD - US Dollar ($)</option>
                    <option value="INR">INR - Indian Rupee (₹)</option>
                    <option value="EUR">EUR - Euro (€)</option>
                    <option value="GBP">GBP - British Pound (£)</option>
                    <option value="AUD">AUD - Australian Dollar (A$)</option>
                    <option value="CAD">CAD - Canadian Dollar (C$)</option>
                  </select>
                </div>
              </div>

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

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Stage Status (Deals in this stage will be marked as:)</label>
                <select 
                  value={currentStageStatus}
                  onChange={(e) => setCurrentStageStatus(e.target.value)}
                  disabled={modalType === 'edit'}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: modalType === 'edit' ? '#f3f4f6' : 'white', cursor: modalType === 'edit' ? 'not-allowed' : 'auto' }}
                >
                  <option value="Open">Open</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
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

      {isIntegrationModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '450px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {integrationType === 'email' ? <Mail size={20} color="#3b82f6" /> : <Webhook size={20} color="#a855f7" />}
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>
                  {integrationType === 'email' ? 'Email Settings' : 'API Settings'}
                </h2>
              </div>
              <button onClick={() => setIsIntegrationModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {integrationType === 'email' ? (
                <>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                      <Server size={14} /> Provider
                    </label>
                    <select 
                      value={integrationForm.provider || ''} 
                      onChange={(e) => setIntegrationForm({...integrationForm, provider: e.target.value})}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', color: '#0f172a', backgroundColor: 'white', outline: 'none' }}
                    >
                      <option value="SMTP">Custom SMTP</option>
                      <option value="Gmail">Google Workspace (Gmail)</option>
                      <option value="Outlook">Microsoft Outlook</option>
                      <option value="SendGrid">SendGrid</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                      <Mail size={14} /> Email Address
                    </label>
                    <input 
                      type="email" 
                      value={integrationForm.email || ''} 
                      onChange={(e) => setIntegrationForm({...integrationForm, email: e.target.value})}
                      placeholder="e.g. admin@yourcompany.com"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                      <Lock size={14} /> Password / App Password
                    </label>
                    <input 
                      type="password" 
                      value={integrationForm.password || ''} 
                      onChange={(e) => setIntegrationForm({...integrationForm, password: e.target.value})}
                      placeholder="Enter password"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                      <Server size={14} /> API Endpoint URL
                    </label>
                    <input 
                      type="url" 
                      value={integrationForm.endpoint || ''} 
                      onChange={(e) => setIntegrationForm({...integrationForm, endpoint: e.target.value})}
                      placeholder="https://api.yourservice.com"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                      <Key size={14} /> API Key / Token
                    </label>
                    <input 
                      type="password" 
                      value={integrationForm.apiKey || ''} 
                      onChange={(e) => setIntegrationForm({...integrationForm, apiKey: e.target.value})}
                      placeholder="Enter your API key"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', color: '#0f172a', boxSizing: 'border-box', outline: 'none' }}
                    />
                    <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#64748b' }}>Your API key will be securely encrypted.</p>
                  </div>
                </>
              )}
            </div>

            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
              <button 
                onClick={() => setIsIntegrationModalOpen(false)}
                style={{ padding: '10px 16px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#475569' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveIntegration}
                style={{ padding: '10px 20px', backgroundColor: integrationType === 'email' ? '#3b82f6' : '#a855f7', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
              >
                Save Integration
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AppSettings;
