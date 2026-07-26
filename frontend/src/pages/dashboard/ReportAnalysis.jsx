
import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download } from 'lucide-react';

const ReportAnalysis = ({ users = [], leads, deals }) => {
  const { currency, pipelineStages, companyName } = useSettings();
  const isSalesRole = (roleStr) => {
    if (!roleStr) return true;
    const normalized = roleStr.toUpperCase();
    if (normalized.includes('ADMIN') || normalized.includes('MANAGER')) return false;
    return true; // Defaults to sales user for everything else
  };

  // Get all sales users from the system to show in the report
  const salespersons = users.length > 0 
    ? users.filter(u => isSalesRole(u.role)).map(u => u.name).filter(Boolean)
    : [...new Set(leads.map(lead => lead.assignedTo))].filter(Boolean);

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

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

  const getDealStatus = (dealStage) => {
    const stageObj = pipelineStages.find(s => s.name === dealStage || s.name.toLowerCase().includes(dealStage.toLowerCase()));
    return stageObj ? (stageObj.status || 'Open') : 'Open';
  };

  const salesReport = salespersons.map(sp => {
    const spDeals = deals.filter(d => getSalespersonForDeal(d) === sp);
    const wonDeals = spDeals.filter(d => getDealStatus(d.stage) === 'Won');
    const revenue = wonDeals.reduce((sum, d) => sum + parseValue(d.value), 0);
    return {
      salesperson: sp,
      dealsWon: wonDeals.length,
      revenue: formatCurrency(revenue)
    };
  });

  const handleDownload = (type) => {
    const filteredDeals = deals.filter(d => getDealStatus(d.stage) === 'Won').filter(d => {
      if (!d.closeDate) return false;
      const closeDateObj = new Date(d.closeDate);
      const fromObj = fromDate ? new Date(fromDate) : new Date('1900-01-01');
      const toObj = toDate ? new Date(toDate) : new Date('2100-01-01');
      return closeDateObj >= fromObj && closeDateObj <= toObj;
    });

    if (filteredDeals.length === 0) {
      alert("No won deals found for this date range.");
      return;
    }

    if (type === 'csv') {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Deal Title,Contact,Value,Close Date,Salesperson\n";
      filteredDeals.forEach(d => {
        const sp = getSalespersonForDeal(d);
        const cleanValue = d.value ? d.value.toString().replace(/,/g, '') : 0;
        csvContent += `"${d.title}","${d.contact}",${cleanValue},"${d.closeDate}","${sp}"\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `won_deals_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (type === 'excel') {
      const data = filteredDeals.map(d => ({
        "Deal Title": d.title,
        "Contact": d.contact,
        "Value": d.value ? Number(d.value.toString().replace(/,/g, '')) : 0,
        "Close Date": d.closeDate,
        "Salesperson": getSalespersonForDeal(d)
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Won Deals");
      XLSX.writeFile(wb, "won_deals_report.xlsx");
    } else if (type === 'pdf') {
      const doc = new jsPDF();

      const pageWidth = doc.internal.pageSize.getWidth();

      // Top Center Company Name
      doc.setFontSize(22);
      doc.setTextColor(31, 41, 55);
      doc.text(companyName || 'Company Name', pageWidth / 2, 20, { align: 'center' });

      // Separator Line
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.5);
      doc.line(14, 28, pageWidth - 14, 28);

      // Title & Dates
      doc.setFontSize(16);
      doc.setTextColor(17, 24, 39);
      doc.text("Won Deals Report", 14, 40);

      doc.setFontSize(11);
      doc.setTextColor(107, 114, 128);
      doc.text(`Date Range: ${fromDate || 'All time'} to ${toDate || 'All time'}`, 14, 48);

      // PDF Currency formatter avoids unicode symbols (like ₹) which corrupt standard jsPDF fonts
      const formatCurrencyForPdf = (num) => {
        const code = currency?.label?.split(' ')[0] || 'Rs.';
        return `${code} ${num.toLocaleString('en-IN')}`;
      };

      // Summary Stats
      const totalDeals = filteredDeals.length;
      const totalRevenue = filteredDeals.reduce((sum, d) => sum + parseValue(d.value), 0);

      doc.setFontSize(11);
      doc.setTextColor(17, 24, 39);
      doc.text(`Total Deals: ${totalDeals}`, pageWidth - 14, 40, { align: 'right' });
      doc.text(`Total Revenue: ${formatCurrencyForPdf(totalRevenue)}`, pageWidth - 14, 46, { align: 'right' });

      doc.setFontSize(10);
      doc.setTextColor(156, 163, 175);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 14, 52, { align: 'right' });

      const tableColumn = ["Deal Title", "Contact", "Value", "Close Date", "Salesperson"];
      const tableRows = [];

      filteredDeals.forEach(d => {
        const dealData = [
          d.title || 'N/A',
          d.contact || 'N/A',
          d.value ? formatCurrencyForPdf(parseValue(d.value)) : '0',
          d.closeDate || 'N/A',
          getSalespersonForDeal(d) || 'N/A'
        ];
        tableRows.push(dealData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 60,
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 6, textColor: [55, 65, 81] },
        columnStyles: {
          2: { halign: 'right' }
        },
        alternateRowStyles: { fillColor: [249, 250, 251] }
      });

      doc.save(`won_deals_report_${new Date().toISOString().split('T')[0]}.pdf`);
    }

    setIsDownloadModalOpen(false);
  };

  const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
  };

  const teamPerformance = salespersons.map(sp => {
    const totalLeads = leads.filter(l => l.assignedTo === sp).length;
    const spDeals = deals.filter(d => getSalespersonForDeal(d) === sp);
    const openDeals = spDeals.filter(d => d.status === 'Open').length;
    const dealsWon = spDeals.filter(d => d.status === 'Won').length;

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
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#1f2937', fontWeight: '600' }}>Sales Report — Deals Won by Salesperson</h3>
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Download size={16} />
              Download Report
            </button>
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

      {isDownloadModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>Download Report</h2>
              <button onClick={() => setIsDownloadModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', gap: '12px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', backgroundColor: '#f9fafb' }}>
              <button
                onClick={() => setIsDownloadModalOpen(false)}
                style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#374151' }}
              >
                Cancel
              </button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleDownload('csv')}
                  style={{ padding: '8px 16px', backgroundColor: '#3b82f6', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: 'white' }}
                >
                  CSV
                </button>
                <button
                  onClick={() => handleDownload('excel')}
                  style={{ padding: '8px 16px', backgroundColor: '#10b981', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: 'white' }}
                >
                  Excel
                </button>
                <button
                  onClick={() => handleDownload('pdf')}
                  style={{ padding: '8px 16px', backgroundColor: '#ef4444', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: 'white' }}
                >
                  PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportAnalysis;
