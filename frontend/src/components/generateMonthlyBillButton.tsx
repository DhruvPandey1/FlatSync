"use client"
import styles from "@/styles/GenerateMonthlyBills.module.css"
export default function GenerateMonthlyBillButton(){

    const handleBills=async()=>{
        const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/generate-monthly-bills`,{
            method:'POST',
            credentials:"include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ month:new Date().toLocaleDateString('en-CA', {timeZone: 'Asia/Kolkata'}) })
        })
        const data=await res.json()
        alert(data.ok?data.message:data.error)
    }
    return(
        <button className={styles.generateBtn} type="button" onClick={handleBills}>+ Generate Monthly Bills</button>
    )
}