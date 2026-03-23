import ProfileForm from '@/components/profile/admin/ProfileForm';
import styles from './Profile.module.css';
import { cookies } from 'next/headers';

async function getAdminData() {
  const cookieStore=await cookies();
  const token=cookieStore.get('admin_token')?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/me`, {
    headers: { 'Authorization':`Bearer ${token}`},
    cache: 'no-store'
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function AdminProfilePage() {
  const adminData = await getAdminData();

  return (
    <div className={styles.container}>
      <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Account Settings</h1>
          <p>Manage your administrative profile and security.</p>
        </div>
      </header>

      <div className={styles.content}>
        <ProfileForm initialData={adminData} />
      </div>
    </div>
  );
}