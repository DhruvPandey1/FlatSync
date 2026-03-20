import { cookies } from 'next/headers'
import styles from './profile.module.css'
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/profile/ProfileForm';


async function getUserProfile(){
    const cookieStore= await cookies();
    // const userId=cookieStore.get('session_id')?.value;
    const userId="64e155fc-c947-48d7-9814-bbff912e1874"

    if(!userId) redirect('/login');

    const res=await fetch(`http://localhost:5000/api/user/fetch-profile`,{
        headers:{
            'x-user-id':userId,
            'x-role':'RESIDENT'
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