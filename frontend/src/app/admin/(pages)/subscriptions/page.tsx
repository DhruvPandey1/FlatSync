import PlanRates from '@/components/PlanRates';
import styles from './Subscriptions.module.css';
import { cookies } from 'next/headers';

async function getPlanTypes() {
  const cookieStore=await cookies();
  const token= cookieStore.get('admin_token')?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/plan-types`, {
    headers:{
      "Authorization":`Bearer ${token}`
    },
    cache: 'no-store' 
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function SubscriptionsPage() {
  const plans = await getPlanTypes();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Subscription Plans</h1>
        <p>Manage and update monthly maintenance rates for different flat types.</p>
      </header>

      <div className={styles.content}>
        <PlanRates initialPlans={plans} />
      </div>
    </div>
  );
}


