import FlatsTable from '@/components/Flats/FlatsTable';
import styles from './Flats.module.css';
import { cookies } from 'next/headers';

async function getFlatData() {
    const cookieStore= await cookies();
    const token=cookieStore.get('admin_token')?.value
    const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/flats`,{
        headers:{
            "Authorization":`Bearer ${token}`
        },
        cache:'no-store'
    });

    return res.ok?await res.json():[];
}

export default async function AdminFlats() {
    const flats=await getFlatData();

    return(
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>Flats Management</h1>
                    <p>Total Registered Flats:{flats.length}</p>
                </div>
            </header>
            <div className={styles.tableSection}>
                <FlatsTable initialData={flats}/>
            </div>
        </div>
    )
}