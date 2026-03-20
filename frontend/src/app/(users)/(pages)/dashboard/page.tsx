import { cookies } from "next/headers"
import { redirect } from "next/navigation";
import styles from './dashboard.module.css'
import PayButton from "@/components/PayButton";
import FCMHandler from "@/components/fcm/FCMHandler";


async function getDashboardData(){
    const cookieStore=await cookies();
    // const userId=cookieStore.get('session_id')?.value;
    const userId="64e155fc-c947-48d7-9814-bbff912e1874"
    if(!userId) redirect('/login');

    const res=await fetch('http://localhost:5000/api/user/dashboard',{
        headers:{
            'x-user-id':userId,
            'x-role':'RESIDENT'
        },
        next:{revalidate: 0}
    });

    if(!res.ok) return null;

    return res.json();
}

export default async function UserDashboard() {
    const data=await getDashboardData();
    const userId="64e155fc-c947-48d7-9814-bbff912e1874"
    if(!data) return <div className={styles.error}>Error loading dashboard.</div>;

    const {flat_info,notifications}=data;

    return(
        <div className={styles.container}>
            <FCMHandler userId={userId}/>
            <header className={styles.header}>
                <h1>Welcome, {flat_info.wing}-{flat_info.flat_number}</h1>
                <p>Member since {new Date().getFullYear()}</p>
            </header>

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

            <section className={styles.notifications}>
                <h2>Recent Notifications</h2>
                {notifications.length>0?(
                    notifications.map((n:any)=>(
                        <div key={n.id} className={styles.note}>
                            <p>{n.message}</p>
                            <small>{new Date(n.created_at).toLocaleDateString()}</small>
                        </div>
                    ))
                ):(
                    <p> No new updates from management.</p>
                )}

            </section>
        </div>
    )
}