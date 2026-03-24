import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.backgroundGlow} />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome to <span className={styles.brand}>FlatSync</span></h1>
          <p className={styles.subtitle}>Select your portal to continue</p>
        </div>
        
        <div className={styles.cardsContainer}>
          <Link href="/login" className={styles.card}>
            <div className={styles.cardGlow} />
            <div className={styles.cardContent}>
              <div className={styles.iconContainer}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.icon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <h2>Resident Portal</h2>
              <p>Access your flat details, view bills, and manage your payments.</p>
              <span className={styles.cardAction}>Login as Resident &rarr;</span>
            </div>
          </Link>

          <Link href="/admin/login" className={`${styles.card} ${styles.adminCard}`}>
            <div className={styles.cardGlow} />
            <div className={styles.cardContent}>
              <div className={styles.iconContainer}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.icon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <h2>Admin Portal</h2>
              <p>Manage FlatSync operations, billing, and resident information.</p>
              <span className={styles.cardAction}>Login as Admin &rarr;</span>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
