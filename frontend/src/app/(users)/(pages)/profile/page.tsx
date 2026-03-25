import { cookies } from 'next/headers'
import styles from './profile.module.css'
import ProfileForm from '@/components/profile/ProfileForm';


async function getUserProfile(){
    const cookieStore=await cookies();
    const token=cookieStore.get('token')?.value;

    const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/fetch-profile`,{
        headers:{
            'Authorization':`Bearer ${token}`
        },
        cache:'no-store'
    });

    return res.json();
}

export default async function ProfilePage() {
    const user=await getUserProfile();

    return(
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.avatar}>
                        {user?.full_name?.charAt(0)||'U'}
                    </div>
                    <h1>{user?.full_name}</h1>
                    <p>{user?.email}</p>
                </header>
                
                <ProfileForm initialData={user}/>
            </div>
        </div>
        
    )
}