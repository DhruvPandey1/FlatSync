import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import styles from './SubscriptionDetail.module.css'
import ReceiptDownloadBtn from "@/components/payments/ReceiptDownloadBtn";
import PayButton from "@/components/PayButton";
async function getRecordDetail(month:string){
    const cookieStore=await cookies();
    const token=cookieStore.get('token')?.value;
    if(!token) redirect('/login');
    const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/subscriptions/${month}`,{
        headers:{
            'Authorization':`Bearer ${token}`
        },
        cache:'no-store'
    });

    if(!res.ok) return null;
    return res.json();
}

export default async function SubscriptionDetail({params}:{
    params:{month:string}
}){
    const {month}=await params;
    const record=await getRecordDetail(month);

    if(!record) notFound();

    const isPaid=record.status==='PAID';
    return(
        <div className={styles.container}>
            <div className={styles.receiptCard}>
                <header className={styles.receiptHeader}>
                    <div className={styles.meta}>
                        <span className={isPaid?styles.badgePaid:styles.badgePending}>
                            {record.status}
                        </span>
                        <h1>{month}</h1>
                    </div>
                    {isPaid && <ReceiptDownloadBtn month={month}/>}
                </header>
                <div className={styles.breakdown}>
                    <div className={styles.row}>
                        <span>Flat Maintenance</span>
                        <span>Rs.{record.amount_due}</span>
                    </div>

                    <div className={`${styles.row} ${styles.total}`}>
                        <span>Total Payable</span>
                        <span>Rs.{record.amount_due}</span>
                    </div>
                </div>
                {isPaid?(
                    <div className={styles.paymentInfo}>
                        <h4>Payment Details</h4>
                        <p>Method: {record.method}</p>
                        <p>Transaction ID:{record.transaction_id}</p>
                        <p>Paid On: {new Date(record.paid_at).toLocaleDateString()}</p>
                    </div>
                ):(
                    <div className={styles.actionArea}>
                        <p>Please clear your dues to avoid late fees.</p>
                        <PayButton amount={record.amount_due} status={record.status} link={`/pay-now/${new Date(record.billing_month).toLocaleDateString('en-CA', {timeZone: 'Asia/Kolkata'})}`}/>
                    </div>
                )}
            </div>
        </div>
    )
}