"use client";
import { useState } from 'react';
import styles from '@/styles/NotificationForm.module.css';

export default function NotificationForm() {
  const [msg, setMsg] = useState({ title: '', body: '', type: 'ALL' });
  const [loading, setLoading] = useState(false);

  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('http://localhost:5000/api/admin/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-role': 'ADMIN' },
      body: JSON.stringify(msg)
    });

    if (res.ok) {
      alert("Notification sent successfully!");
      setMsg({ title: '', body: '', type: 'ALL' });
    }
    setLoading(false);
  };

  return (
    <div className={styles.card}>
      <h3>Create New Broadcast</h3>
      <form onSubmit={sendNotification} className={styles.form}>
        <div className={styles.group}>
          <label>Notification Title</label>
          <input 
            placeholder="e.g., Maintenance Due" 
            value={msg.title} 
            onChange={(e) => setMsg({...msg, title: e.target.value})} 
            required 
          />
        </div>

        <div className={styles.group}>
          <label>Message Body</label>
          <textarea 
            placeholder="Please pay your 2BHK subscription before 5th..." 
            value={msg.body}
            onChange={(e) => setMsg({...msg, body: e.target.value})}
            required
          />
        </div>

        <div className={styles.group}>
          <label>Target Audience</label>
          <select value={msg.type} onChange={(e) => setMsg({...msg, type: e.target.value})}>
            <option value="ALL">All Residents</option>
            <option value="PENDING">Only Pending Payments</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className={styles.sendBtn}>
          {loading ? 'Sending...' : 'Send Notification'}
        </button>
      </form>
    </div>
  );
}