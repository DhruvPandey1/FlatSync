import ReportsClient from '@/components/ReportsClient';
import styles from './Reports.module.css';
import { cookies } from 'next/headers';

async function getReportSummary(month: string, year: string) {
  const cookieStore=await cookies();
  const token=cookieStore.get('admin_token')?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/reports-summary?month=${month}&year=${year}`, {
    headers: { "Authorization":`Bearer ${token}`},
    cache: 'no-store'
  });
  return res.ok ? res.json() : { total_collected: 0, total_pending: 0, count: 0 };
}

export default async function ReportsPage({ searchParams }: any) {
  const date = new Date();
  const month = await(searchParams.month) || (date.getMonth() + 1).toString();
  const year = await(searchParams.year) || date.getFullYear().toString();

  const summary = await getReportSummary(month, year);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Financial Reports</h1>
        <p>Download and analyze society subscription data.</p>
      </header>

      <ReportsClient 
        summary={summary} 
        currentMonth={month} 
        currentYear={year} 
      />
    </div>
  );
}
