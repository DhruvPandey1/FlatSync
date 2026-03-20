import ReportsClient from '@/components/ReportsClient';
import styles from './Reports.module.css';

async function getReportSummary(month: string, year: string) {
  const res = await fetch(`http://localhost:5000/api/admin/reports-summary?month=${month}&year=${year}`, {
    headers: { 'x-role': 'admin' },
    cache: 'no-store'
  });
  return res.ok ? res.json() : { total_collected: 0, total_pending: 0, count: 0 };
}

export default async function ReportsPage({ searchParams }: any) {
  const date = new Date();
  const month = searchParams.month || (date.getMonth() + 1).toString();
  const year = searchParams.year || date.getFullYear().toString();

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
