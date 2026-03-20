"use client";

import styles from '@/styles/PaymentTerminal.module.css';
import { useState } from 'react';

interface PaymentProps{
    amount:number;
    month:string;
    isCumulative:boolean;
}

export default function PaymentTerminal({amount,month,isCumulative}:PaymentProps){
    const [loading,setLoading]=useState(false);

    const startPayment=async()=>{
        setLoading(true);

        try{
            const orderRes=await fetch('http://localhost:5000/api/user/create-order',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({amount,month,isCumulative})
            });

            const orderData =await orderRes.json();
            if(!orderRes.ok) throw new Error(orderData.message);

            const options={
                key:process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                amount:orderData.amount,
                currency:"INR",
                name:"Society Manager",
                description:isCumulative?"Clearing All Dues":`Payment for ${month}`,
                order_id:orderData.id,
                handler:async function (response:any) {
                    const verifyRes=await fetch('http://localhost:5000/api/user/verify-payment',{
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        body:JSON.stringify({
                            ...response,
                            isCumulative,
                            month
                        })
                    });
                    if(verifyRes.ok){
                        window.location.href=`/dashboard?payment=success`
                    }
                    else{
                        alert("Payment verification failed. Please contact admin.")
                    }
                },

                theme:{color:"#2563eb"}
            };

            const rzp=new(window as any).Razorpay(options);

            rzp.open();
        }
        catch(error:any){
            alert("Error: "+ error.message)
        }
        finally{
            setLoading(false);
        }
    };

    return(
        <div className={styles.terminalWrapper}>
            <button 
                className={styles.mainPayBtn}
                onClick={startPayment}
                disabled={loading||amount<=0}
            >
                {loading?(
                    <span className={styles.loader}>Processing...</span>
                ):(
                    `Securely Pay Rs.${amount}`
                )}
            </button>
            <p className={styles.disclaimer}>
                By clicking, you agree to the society payment terms.
            </p>
        </div>
    )
}