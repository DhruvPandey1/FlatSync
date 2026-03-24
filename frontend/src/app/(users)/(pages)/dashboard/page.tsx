import { cookies } from "next/headers"
import { redirect } from "next/navigation";
import styles from './dashboard.module.css'
import PayButton from "@/components/PayButton";
import FCMHandler from "@/components/fcm/FCMHandler";
import DismissNotificationButton from "@/components/Notifications/DismissNotificationButton";


async function getDashboardData(){
    const cookieStore=await cookies();
    const token=cookieStore.get('token')?.value;
    if(!token) redirect('/login');

    const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/dashboard`,{
        headers:{
            'Authorization':`Bearer ${token}`
        },
        next:{revalidate: 0}
    });

    if(!res.ok) return null;

    return res.json();
}

export default async function UserDashboard() {
    const data=await getDashboardData();
    if(!data) return <div className={styles.error}>Error loading dashboard.</div>;
    const cookieStore=await cookies();
    const token=cookieStore.get('token')?.value;

    const {flat_info,notifications}=data;

    return(
        <div className={styles.container}>
            <FCMHandler authToken={token}/>
            <header className={styles.header}>
                <h1>Welcome{flat_info?.wing ? `, ${flat_info.wing}-${flat_info.flat_number}` : ''}</h1>
                <p>Member since {new Date().getFullYear()}</p>
            </header>

            {!flat_info ? (
                <div className={styles.card} style={{ textAlign: 'center', padding: '3rem 1rem', margin: '2rem 0' }}>
                    <h3>No Flat Assigned</h3>
                    <p style={{ marginTop: '1rem', color: '#666' }}>You have not been assigned to a flat yet. Please contact the administration.</p>
                </div>
            ) : (
                <div className={styles.statsGrid}>
                    <div className={styles.card}>
                        <h3>Current Status</h3>
                        <span className={flat_info.current_month_status==='PAID'?styles.paid:styles.pending}>
                            {flat_info.current_month_status}
                        </span>
                    </div>

                    <div className={styles.card}>
                        <h3>Outstanding Dues</h3>
                        <p className={styles.amount}>Rs. {flat_info.total_pending_debt}</p>
                        <PayButton amount={flat_info.total_pending_debt} status={flat_info.current_month_status} link={`/pay-now/${new Date().getMonth()}?type=all`}/>
                    </div>
                </div>
            )}

            <section className={styles.notifications}>
                <h2>Recent Notifications</h2>
                {notifications.length>0?(
                    notifications.map((n:any)=>(
                        <div key={n.id} className={styles.note}>
                            <p>{n.message}</p>
                            <small>{new Date(n.created_at).toLocaleDateString()}</small>
                            <DismissNotificationButton id={n.id} />
                        </div>
                    ))
                ):(
                    <p> No new updates from management.</p>
                )}

            </section>
        </div>
    )
}