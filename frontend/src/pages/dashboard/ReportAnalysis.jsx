import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

const ReportAnalysis = ({ leads, deals }) => {
  const { currency, pipelineStages } = useSettings();
  const wonStage = pipelineStages[pipelineStages.length - 1]?.name || 'Closed Won';
  const salespersons = [...new Set(leads.map(lead => lead.assignedTo))].filter(Boolean);

  const parseValue = (valStr) => {
    if (!valStr) return 0;
    const cleanStr = valStr.toString().replace(/,/g, '');
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
  };

  const formatCurrency = (num) => {
    return currency.symbol + num.toLocaleString('en-IN');
  };

  const getSalespersonForDeal = (deal) => {
    const lead = leads.find(l => l.name === deal.contact);
    return lead ? lead.assignedTo : 'Unassigned';
  };

  const salesReport = salespersons.map(sp => {
    const spDeals = deals.filter(d => getSalespersonForDeal(d) === sp);
    const wonDeals = spDeals.filter(d => d.stage === wonStage || d.stage === 'Won');
    const revenue = wonDeals.reduce((sum, d) => sum + parseValue(d.value), 0);
    return {
      salesperson: sp,
      dealsWon: wonDeals.length,
      revenue: formatCurrency(revenue)
    };
  });

  const teamPerformance = salespersons.map(sp => {
    const totalLeads = leads.filter(l => l.assignedTo === sp).length;
    const spDeals = deals.filter(d => getSalespersonForDeal(d) === sp);
    const openDeals = spDeals.filter(d => d.stage !== wonStage && d.stage !== 'Won' && d.stage !== 'Lost').length;
    const dealsWon = spDeals.filter(d => d.stage === wonStage || d.stage === 'Won').length;
    
    return {
      salesperson: sp,
      totalLeads,
      openDeals,
      dealsWon
    };
  });

  return (
    <div>
      <div style={{ paddingBottom: '24px' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#1f2937', fontWeight: '600' }}>Sales Report — Deals Won by Salesperson</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#ffffff', color: '#9ca3af', fontSize: '11px', fontWeight: '600', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', borderTop: '1px solid #e5e7eb' }}>SALESPERSON</th>
                <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', borderTop: '1px solid #e5e7eb' }}>DEALS WON</th>
                <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', borderTop: '1px solid #e5e7eb' }}>REVENUE</th>
              </tr>
            </thead>
            <tbody>
              {salesReport.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px 24px', color: '#1f2937', fontSize: '14px', fontWeight: '600' }}>{row.salesperson}</td>
                  <td style={{ padding: '16px 24px', color: '#4b5563', fontSize: '14px' }}>{row.dealsWon}</td>
                  <td style={{ padding: '16px 24px', color: '#4b5563', fontSize: '14px' }}>{row.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ height: '8px' }}></div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#1f2937', fontWeight: '600' }}>Team Performance</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#ffffff', color: '#9ca3af', fontSize: '11px', fontWeight: '600', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', borderTop: '1px solid #e5e7eb' }}>SALESPERSON</th>
                <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', borderTop: '1px solid #e5e7eb' }}>TOTAL LEADS</th>
                <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', borderTop: '1px solid #e5e7eb' }}>OPEN DEALS</th>
                <th style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', borderTop: '1px solid #e5e7eb' }}>DEALS WON</th>
              </tr>
            </thead>
            <tbody>
              {teamPerformance.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px 24px', color: '#1f2937', fontSize: '14px', fontWeight: '600' }}>{row.salesperson}</td>
                  <td style={{ padding: '16px 24px', color: '#4b5563', fontSize: '14px' }}>{row.totalLeads}</td>
                  <td style={{ padding: '16px 24px', color: '#4b5563', fontSize: '14px' }}>{row.openDeals}</td>
                  <td style={{ padding: '16px 24px', color: row.dealsWon > 0 ? '#3b82f6' : '#4b5563', fontSize: '14px' }}>{row.dealsWon}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ height: '8px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ReportAnalysis;
