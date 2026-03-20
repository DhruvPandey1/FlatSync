import { cookies } from 'next/headers';
import styles from './PayNow.module.css';
import PaymentTerminal from '@/components/payments/PaymentTerminal';

async function getPaymentDetails(month:string,isCumulative:boolean) {
    const cookieStore=await cookies();
    // const userId=cookieStore.get('session_id')?.value;
    const userId="64e155fc-c947-48d7-9814-bbff912e1874"
    const res=await fetch(`http://localhost:5000/api/user/payments/details?month=${month}&all=${isCumulative}`,{
        headers:{
            'x-user-id':userId||''
            ,'x-role':'RESIDENT'
        },
        cache:'no-store'
    })

    return res.ok? await res.json():null;
}

export default async function PayNowPage({
    params,
    searchParams
}:{
    params:{month:string},
    searchParams:{type?:string}
}) {
    const {type}=await searchParams
    const isCumulative= type==='all'
    const {month}=await params
    const data=await getPaymentDetails(month,isCumulative);

    if(!data) return <div>Error loading payment details.</div>;

    return(
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1>{isCumulative?'Total Outstanding':'Monthly Bill'}</h1>
                    <p>{isCumulative?'Clear all pending dues':`Bill for ${month.replace('-',' ')}`}</p>
                </header>

                <div className={styles.amountCard}>
                    <span className={styles.label}> Total Payable</span>
                    <h2 className={styles.totalAmount}>Rs. {data.total_amount}</h2>
                </div>

                <div className={styles.breakdown}>
                    {isCumulative && data.pending_months?.map((m:any)=>{
                        <div key={m.month} className={styles.miniRow}>
                            <span>{m.month}</span>
                            <span>{m.amount}</span>
                        </div>
                    })}
                </div>

                <PaymentTerminal
                    amount={data.total_amount}
                    month={month}
                    isCumulative={isCumulative}
                />
            </div>
        </div>
    )
}