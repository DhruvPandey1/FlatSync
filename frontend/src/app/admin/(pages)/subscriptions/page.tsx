import PlanRates from '@/components/PlanRates';
import styles from './Subscriptions.module.css';

async function getPlanTypes() {
  const res = await fetch('http://localhost:5000/api/admin/plan-types', {
    headers:{
        "x-role":"ADMIN"
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


