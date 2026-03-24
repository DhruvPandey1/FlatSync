"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DismissNotificationButton({ id }: { id: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const dismiss = async () => {
        setLoading(true);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/notification-read?notificationId=${id}`, {
                method: 'PUT',
                credentials: 'include'
            });
            router.refresh();
        } catch(err) {
            console.error(err);
            setLoading(false);
        }
    }
    
    return (
        <button 
           onClick={dismiss} 
           disabled={loading}
           style={{ 
             background: 'transparent', 
             border: 'none', 
             color: '#3b82f6', 
             cursor: loading ? 'wait' : 'pointer', 
             padding: 0, 
             marginTop: '8px', 
             fontSize: '13px',
             fontWeight: 500,
             textAlign: 'left'
           }}
        >
           {loading ? 'Marking as read...' : 'Mark as read'}
        </button>
    )
}
