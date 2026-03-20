"use client";
import styles from '@/styles/ReportsClient.module.css';

export default function ReportsClient({ summary, currentMonth, currentYear }: any) {
  
  const handleDownload = (type: 'csv' | 'pdf') => {
    const downloadUrl = `http://localhost:5000/api/admin/export-report?type=${type}&month=${currentMonth}&year=${currentYear}`;
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.statsGrid}>
        <div className={styles.card}>
          <span>Collection Summary</span>
          <h3>₹{summary.total_collected.toLocaleString()}</h3>
          <p>Total received for {currentMonth}/{currentYear}</p>
        </div>
        <div className={styles.card}>
          <span>Pending Dues</span>
          <h3 className={styles.danger}>₹{summary.total_pending.toLocaleString()}</h3>
          <p>Amount yet to be collected</p>
        </div>
      </div>

      <div className={styles.exportBox}>
        <h3>Export Monthly Data</h3>
        <p>Generate a detailed list of all flats with their payment status and transaction IDs.</p>
        
        <div className={styles.btnGroup}>
          <button onClick={() => handleDownload('csv')} className={styles.csvBtn}>
            Download CSV (Excel)
          </button>
          <button onClick={() => handleDownload('pdf')} className={styles.pdfBtn}>
            Download PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}


