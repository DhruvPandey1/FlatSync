
import { cookies } from "next/headers";
import styles from "./Login.module.css";

import LoginForm from "@/components/auth/LoginForm";
import { redirect } from "next/navigation";

export default async function AdminLogin() {

  const cookieStore=await cookies();
  const token=cookieStore.get('admin_token')?.value;
  if(token) redirect('/admin/dashboard')
  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.logoSection}>
          <h1>FlatSync Admin</h1>
          <p>Sign in to manage flats and subscriptions</p>
        </div>        
        <LoginForm type="ADMIN"/>
        <footer className={styles.footer}>
          <p>Protected by FlatSync Subscription Management System</p>
        </footer>
      </div>
    </div>
  );
}