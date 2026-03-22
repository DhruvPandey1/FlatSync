import { cookies } from 'next/headers';
import styles from './login.module.css';
import LoginForm from '@/components/auth/LoginForm';
import { redirect } from 'next/navigation';
export default async function LoginPage(){
    const cookieStore=await cookies();
    const token=cookieStore.get('token')?.value;
    if(token) redirect("/dashboard");
    return(
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>User Login</h2>
                <p>Access your society dashboard</p>
                
            </div>
            <LoginForm type="RESIDENT"/>
        </div>
    )
}