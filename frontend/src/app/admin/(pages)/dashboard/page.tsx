
import { cookies } from 'next/headers';
import styles from './Dashboard.module.css';
import { redirect } from 'next/navigation';

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
                    <h1>Society Statistics</h1>
                    <p>Real-time data</p>
                </div>
                <button className={styles.generateBtn}>+ Generate Monthly Bills</button>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.card}>
                    <p className={styles.cardTitle}>Total collection</p>
                    <h2 style={{color:"#10b981"}}>Rs. {data.stats.total_collected}</h2>
                    <span className={styles.cardTrend}>This Month</span>
                </div>
                
                <div className={styles.card}>
                    <p className={styles.cardTitle}>Pending Dues</p>
                    <h2 style={{color:"#ef4444"}}>Rs. {data.stats.total_pending}</h2>
                </div>

                <div className={styles.card}>
                    <p className={styles.cardTitle}>Total Residents</p>
                    <h2 style={{color:"#3b82f6"}}>{data.stats.total_flats}</h2>
                    <span className={styles.cardTrend}>Registered Flats</span>
                </div>
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
                            {data.recent_payments.map((p:any)=>(
                                <tr key={p.id}>
                                    <td>{p.flat_number}</td>
                                    <td>{p.full_name}</td>
                                    <td>{p.amount_due}</td>
                                    <td><span className={p.status==='PAID'?styles.statusPaid:styles.statusPending}>{p.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}