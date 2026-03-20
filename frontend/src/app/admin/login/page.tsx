"use client"
import styles from "./Login.module.css";

import LoginForm from "@/components/auth/LoginForm";

export default function AdminLogin() {
  
    
 
  

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.logoSection}>
          <h1>Society Admin</h1>
          <p>Sign in to manage flats and subscriptions</p>
        </div>        
        <LoginForm type="ADMIN"/>
        <footer className={styles.footer}>
          <p>Protected by Society Subscription Management System</p>
        </footer>
      </div>
    </div>
  );
}