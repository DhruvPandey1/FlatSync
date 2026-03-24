
import { cookies } from 'next/headers';
import styles from './Dashboard.module.css';
import { redirect } from 'next/navigation';
import GenerateMonthlyBillButton from '@/components/generateMonthlyBillButton';
import AdminStatsChart from '@/components/AdminStatsChart';
import CreateUserModal from '@/components/CreateUserModal';
import { Card } from '@/components/ui/Card';

async function getAdminStats() {
    const cookieStore= await cookies();
    const token=cookieStore.get('admin_token')?.value
    if(!token) redirect('/admin/login');
    
    const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`,{
        cache:'no-store',
        headers:{
            'Authorization':`Bearer ${token}`
        }
    })

    if(!res.ok) return null;
    return res.json();
}

export default async function AdminDashboard(){
    const data=await getAdminStats();

    if(!data) return <div>Failed to load stats.</div>

    return(
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>FlatSync Statistics</h1>
                    <p>Real-time data</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <GenerateMonthlyBillButton/>
                    <CreateUserModal/>
                </div>
            </header>

            <div className={styles.statsGrid}>
                <Card className={styles.card}>
                    <p className={styles.cardTitle}>Total collection</p>
                    <h2 style={{color:"#10b981"}}>₹{data.stats.total_collected || 0}</h2>
                    <span className={styles.cardTrend}>This Month</span>
                </Card>
                
                <Card className={styles.card}>
                    <p className={styles.cardTitle}>Pending Dues</p>
                    <h2 style={{color:"#ef4444"}}>₹{data.stats.total_pending || 0}</h2>
                </Card>

                <Card className={styles.card}>
                    <p className={styles.cardTitle}>Total Residents</p>
                    <h2 style={{color:"#3b82f6"}}>{data.stats.total_flats || 0}</h2>
                    <span className={styles.cardTrend}>Registered Flats</span>
                </Card>
            </div>
            <div className={styles.dashboardGrid}>
                <div className={styles.recentActivity}>
                    <h3>Recent Payments</h3>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Flat</th>
                                <th>Resident</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.recent_payments && data.recent_payments.length > 0 ? (
                                data.recent_payments.map((p:any)=>(
                                    <tr key={p.id}>
                                        <td>{p.flat_number}</td>
                                        <td>{p.full_name}</td>
                                        <td>{p.amount_due}</td>
                                        <td><span className={p.status==='PAID'?styles.statusPaid:styles.statusPending}>{p.status}</span></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>No recent payments.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ marginTop: "20px" }}>
                <AdminStatsChart stats={data.stats} />
            </div>
        </div>
    )
}