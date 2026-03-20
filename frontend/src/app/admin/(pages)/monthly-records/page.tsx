import MonthlyRecordsClient from '@/components/MonthlyRecordsClient';

async function getMonthlyData(month: string, year: string) {
  const res = await fetch(`http://localhost:5000/api/admin/monthly-reports?month=${month}&year=${year}`, {
    headers: { 'x-role': 'ADMIN' },
    cache: 'no-store'
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function MonthlyRecordsPage({ searchParams }: any) {
  const date = new Date();
  const {month} = await searchParams || (date.getMonth() + 1).toString();
  const {year} = await searchParams || date.getFullYear().toString();

  const records = await getMonthlyData(month, year);

  return (
    <div style={{ padding: '30px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' ,color:"#0f172a"}}>
        Monthly Subscription Records
      </h1>
      
      <MonthlyRecordsClient 
        records={records} 
        currentMonth={month} 
        currentYear={year} 
      />
    </div>
  );
}