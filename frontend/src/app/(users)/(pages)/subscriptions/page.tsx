import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import styles from './subscriptions.module.css'
import Link from "next/link";

async function getSubscriptionHistory() {
    const cookieStore=await cookies();
    const token=cookieStore.get('token')?.value;
    if(!token) redirect('/login');

    const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/subscriptions`,{
        headers:{
            'Authorization':`Bearer ${token}`
        },
        cache:'no-store'
    });

    if(!res.ok) return [];
    return res.json();
}

export default async function SubscriptionsPage() {
    const history=await getSubscriptionHistory();

    return(
        <div className={styles.container}>
            <header className={styles.headers}>
                <h1>My Bill History</h1>
                <p>View and manage your monthly FlatSync dues</p>
            </header>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length>0?(
                            history.map((record:any,index:number)=>(
                                <tr key={index}>
                                    <td className={styles.monthCol}>
                                        {new Date(record.billing_month).toLocaleDateString('en-IN',{
                                            month:'long',
                                            year:'numeric',
                                        })}
                                    </td>
                                    <td className={styles.amountCol}>₹{record.amount_due}</td>
                                    <td>
                                        <span className={record.status==='PAID'?styles.statusPaid:styles.statusPending}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td>
                                        <Link href={`/subscriptions/${new Date(record.billing_month).toLocaleDateString('en-CA', {timeZone: 'Asia/Kolkata'})}`} className={styles.viewBtn}>
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ):(
                            <tr>
                                <td colSpan={4} className={styles.empty}>No records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}