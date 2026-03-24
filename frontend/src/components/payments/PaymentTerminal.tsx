"use client";

import styles from '@/styles/PaymentTerminal.module.css';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { useRouter } from 'next/navigation';

interface PaymentProps{
    amount:number;
    month:string;
    isCumulative:boolean;
}

export default function PaymentTerminal({amount,month,isCumulative}:PaymentProps){
    const [loading,setLoading]=useState(false);
    const [step, setStep] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');
    const [txnId, setTxnId] = useState('');
    const router = useRouter();

    const startPayment = async () => {
        setLoading(true);
        setStep('PROCESSING');

        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/payments/mock-pay`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    amount,
                    isCumulative,
                    month
                })
            });
            
            const data = await verifyRes.json();
            
            if (verifyRes.ok && data.success) {
                setStep('SUCCESS');
                setTxnId(data.transactionId);
                toast.success('Payment successful!');
                setTimeout(() => {
                    router.push(`/dashboard?payment=success`);
                }, 2000);
            } else {
                toast.error("Payment processing failed. " + (data.error || ''));
                setStep('IDLE');
            }
        } catch (error: any) {
            toast.error("Error: " + error.message);
            setStep('IDLE');
        } finally {
            setLoading(false);
        }
    };

    if (step === 'SUCCESS') {
        return (
            <div className={styles.terminalWrapper} style={{ textAlign: 'center', backgroundColor: '#ecfdf5', borderColor: '#10b981' }}>
                <div style={{ color: '#059669', fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
                <h3 style={{ color: '#065f46', marginBottom: '0.5rem' }}>Payment Successful!</h3>
                <p style={{ color: '#047857', fontSize: '0.9rem' }}>Transaction ID: {txnId}</p>
                <p style={{ color: '#6ee7b7', fontSize: '0.8rem', marginTop: '1rem' }}>Redirecting to dashboard...</p>
            </div>
        );
    }

    return (
        <div className={styles.terminalWrapper}>
            <button 
                className={styles.mainPayBtn}
                onClick={startPayment}
                disabled={loading || amount <= 0}
                style={loading ? { backgroundColor: '#94a3b8', cursor: 'wait' } : {}}
            >
                {step === 'PROCESSING' ? (
                    <span className={styles.loader}>Securely Processing...</span>
                ) : (
                    `Pay ₹${amount}`
                )}
            </button>
            <p className={styles.disclaimer}>
                By clicking, you agree to the FlatSync payment terms.
            </p>
        </div>
    );
}