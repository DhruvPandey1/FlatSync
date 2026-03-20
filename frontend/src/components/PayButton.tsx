"use client";
import styles from '@/styles/Button.module.css'
import { redirect } from 'next/navigation';

interface PayButtonProps{
    amount:number;
    status:string;
    link:string
}

export default function PayButton({amount,status,link}:PayButtonProps){
    const handlePayment=()=>{
        redirect(link)
    };

    return(
        <button
            className={status==='PAID'?styles.disabled:styles.payBtn}
            onClick={handlePayment}
            disabled={status==='PAID'}
        >
            {status==='PAID'?'Already Paid':'Pay Online'}
        </button>
    )
}