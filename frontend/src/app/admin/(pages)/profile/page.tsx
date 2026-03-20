import ProfileForm from '@/components/profile/admin/ProfileForm';
import styles from './Profile.module.css';

async function getAdminData() {
  const res = await fetch('http://localhost:5000/api/admin/me', {
    headers: { 'x-role': 'ADMIN' },
    cache: 'no-store'
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function AdminProfilePage() {
  const adminData = await getAdminData();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Account Settings</h1>
        <p>Manage your administrative profile and security.</p>
      </header>

      <div className={styles.content}>
        <ProfileForm initialData={adminData} />
      </div>
    </div>
  );
}