import NotificationForm from '@/components/Notifications/NotificationForm';
import NotificationHistory from '@/components/Notifications/NotificationHistory';
import styles from './Notifications.module.css';

export default function AdminNotifications() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Push Notifications</h1>
        <p>Send payment reminders and society announcements to residents.</p>
      </header>

      <div className={styles.grid}>
        <section className={styles.formSection}>
          <NotificationForm />
        </section>
        
        <section className={styles.historySection}>
          <NotificationHistory />
        </section>
      </div>
    </div>
  );
}