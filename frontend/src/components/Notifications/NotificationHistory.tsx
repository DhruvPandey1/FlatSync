"use client";
import { useEffect, useState } from 'react';
import styles from '@/styles/NotificationHistory.module.css';

export default function NotificationHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('http://localhost:5000/api/admin/notification-history', {
          headers: { 'x-role': 'ADMIN' }
        });
        const data = await res.json();
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  if (loading) return <p>Loading history...</p>;

  return (
    <div className={styles.card}>
      <h3>Recently Sent</h3>
      <div className={styles.historyList}>
        {history.length === 0 ? (
          <p className={styles.emptyMsg}>No notifications sent yet.</p>
        ) : (
          history.map((item: any) => (
            <div key={item.id} className={styles.historyItem}>
              <div className={styles.historyHeader}>
                <span className={styles.historyTitle}>{item.title}</span>
                <span className={styles.historyDate}>
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className={styles.historyBody}>{item.message}</p>
              <div className={styles.historyFooter}>
                <span className={styles.tag}>{item.is_read?"Read":"Not Read"}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}