import styles from './login.module.css';
import LoginForm from '@/components/auth/LoginForm';
export default function LoginPage(){
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