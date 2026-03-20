import FlatsTable from '@/components/Flats/FlatsTable';
import styles from './Flats.module.css';

async function getFlatData() {
    const res=await fetch('http://localhost:5000/api/admin/flats',{
        headers:{
            "x-role":"ADMIN"
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