"use client"

import { loginAction } from "@/app/actions/auth";
import { useState } from "react"
import styles from './LoginForm.module.css'
import Googlepng from '../../../public/assets/Google.png'

type Role={
    type:'RESIDENT'|'ADMIN'
}
export default function LoginForm({type}:Role){
    const [error,setError]=useState<string|null>(null);
    const [loading,setLoading]=useState(false);

    async function handleSubmit(formData:FormData) {
        setLoading(true);
        setError(null);
        formData.append('loginType',type);

        const result =await loginAction(formData);
        if(result?.error){
            setError(result.error);
            setLoading(false);
        }
    }

    const handleGoogleLogin = async() => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/googleAuth`;
    };

    return(
        type==="RESIDENT"?
        (<form action={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.inputGroup}>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" placeholder="Email" id="email" required />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" placeholder="Password" id="password" required />

            </div>
            <button type="submit" disabled={loading}>
                {loading ?'Verifying...':'Sign In'}
            </button>
        </form>):
    (
        <div className={styles.actionSection}>
          <button onClick={handleGoogleLogin} className={styles.googleBtn}>
            <img 
              src={Googlepng.src}
              alt="Google" 
            />
            <span>Sign in with Google</span>
          </button>
          
          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <form className={styles.manualForm}>
            <input type="email" placeholder="Admin Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit" className={styles.loginBtn}>
              Login with Password
            </button>
          </form>
        </div>
    )
    )
}