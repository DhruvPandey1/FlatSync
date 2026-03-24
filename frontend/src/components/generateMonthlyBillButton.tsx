"use client"
import styles from "@/styles/GenerateMonthlyBills.module.css"
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function GenerateMonthlyBillButton(){
    const router = useRouter();

    const handleBills=async()=>{
        const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/generate-monthly-bills`,{
            method:'POST',
            credentials:"include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ month:new Date().toLocaleDateString('en-CA', {timeZone: 'Asia/Kolkata'}) })
        })
        const data=await res.json()
        if (res.ok) {
            toast.success(data.message);
            router.refresh();
        } else {
            toast.error(data.error || "Failed to generate bills");
        }
    }
    return(
        <Button className={styles.generateBtn} type="button" onClick={handleBills}>+ Generate Monthly Bills</Button>
    )
}