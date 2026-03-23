"use client";

import { useTransition } from 'react';
import { logoutAdmin, logoutAction } from '@/app/actions/auth';
import styles from '@/styles/Sidebar.module.css';

export default function SidebarLogoutButton({ role }: { role: 'ADMIN' | 'RESIDENT' }) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      if (role === 'ADMIN') {
        logoutAdmin();
      } else {
        logoutAction();
      }
    });
  };

  return (
    <div className={styles.logoutWrapper}>
      <button 
        onClick={handleLogout} 
        disabled={isPending}
        className={`${styles.logoutBtn} ${role === 'ADMIN' ? styles.adminLogout : styles.userLogout}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.logoutIcon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
        </svg>
        {isPending ? 'Logging Out...' : 'Log Out'}
      </button>
      
    </div>
  );
}
