"use client";
import { useState } from 'react';
import NotificationForm from '@/components/Notifications/NotificationForm';
import NotificationHistory from '@/components/Notifications/NotificationHistory';
import styles from './Notifications.module.css';

export default function AdminNotifications() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Push Notifications</h1>
        <p>Send payment reminders and FlatSync announcements to residents.</p>
      </header>

      <div className={styles.grid}>
        <section className={styles.formSection}>
          <NotificationForm onSuccess={() => setRefreshKey(k => k + 1)} />
        </section>
        
        <section className={styles.historySection}>
          <NotificationHistory refreshTrigger={refreshKey} />
        </section>
      </div>
    </div>
  );
}