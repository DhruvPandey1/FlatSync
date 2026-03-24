"use client";
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import styles from './PaymentEntry.module.css';
import { Button } from '@/components/ui/Button';

export default function PaymentEntry() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [flatData, setFlatData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if(!searchTerm) return;
    setLoading(true);
    setFlatData(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/pending-by-flat?q=${searchTerm}`,{
        credentials:"include",
        cache:"no-store"
      });
      if (res.ok) {
        const data = await res.json();
        setFlatData(data);
      } else if (res.status === 404) {
        toast.error("Flat does not exist.");
      } else {
        toast.error("Search failed. Flat might not have pending dues.");
      }
    } catch (err) {
      toast.error("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualPay = async (recordId: number, amount: number) => {
    const method = confirm("Was this a Cash payment? (Cancel for UPI)") ? 'CASH' : 'UPI';
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/manual-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials:"include",
        body: JSON.stringify({ record_id: recordId, amount_paid: amount, method })
      });
      
      if(res.ok) {
        toast.success("Payment recorded successfully!");
        handleSearch(); 
        router.refresh();
      } else {
        toast.error("Payment failed");
      }
    } catch (err) {
      toast.error("Payment failed");
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
        <Button onClick={handleSearch} disabled={loading} isLoading={loading}>
          Find Pending Dues
        </Button>
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
                  <Button size="sm" onClick={() => handleManualPay(rec.id, rec.amount_due)}>
                    Mark as Paid
                  </Button>
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