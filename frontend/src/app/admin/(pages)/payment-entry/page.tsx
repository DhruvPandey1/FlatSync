"use client";
import { useState } from 'react';
import styles from './PaymentEntry.module.css';

export default function PaymentEntry() {
  const [searchTerm, setSearchTerm] = useState("");
  const [flatData, setFlatData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if(!searchTerm) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/pending-by-flat?q=${searchTerm}`,{
        headers:{
            "x-role":"ADMIN"
        },
        cache:"no-store"
      });
      const data = await res.json();
      setFlatData(data);
    } catch (err) {
      alert("Flat not found or has no pending dues.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualPay = async (recordId: number, amount: number) => {
    const method = confirm("Was this a Cash payment? (Cancel for UPI)") ? 'CASH' : 'UPI';
    
    try {
      const res = await fetch('http://localhost:5000/api/admin/manual-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' ,"x-role":"ADMIN"},
        body: JSON.stringify({ record_id: recordId, amount_paid: amount, method })
      });
      
      if(res.ok) {
        alert("Payment recorded successfully!");
        handleSearch(); 
      }
    } catch (err) {
      alert("Payment failed");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Manual Payment Entry</h1>
        <p>Record cash or cheque payments received from residents.</p>
      </header>

      <div className={styles.searchBox}>
        <input 
          type="text" 
          placeholder="Enter Flat Number (e.g. A-101)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Find Pending Dues'}
        </button>
      </div>

      {flatData && (
        <div className={styles.resultSection}>
          <div className={styles.flatInfo}>
            <h3>{flatData.full_name}</h3>
            <p>Flat: {flatData.flat_number} | Wing: {flatData.wing}</p>
          </div>

          <div className={styles.pendingList}>
            <h4>Pending Records</h4>
            {flatData.pending_records.length > 0 ? (
              flatData.pending_records.map((rec: any) => (
                <div key={rec.id} className={styles.recordCard}>
                  <div className={styles.recDetails}>
                    <strong>{rec.billing_month}</strong>
                    <span>Amount: ₹{rec.amount_due}</span>
                  </div>
                  <button onClick={() => handleManualPay(rec.id, rec.amount_due)}>
                    Mark as Paid
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.noDues}>No pending dues for this flat.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}