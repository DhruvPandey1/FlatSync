"use client";
import styles from "./AdminLogin.module.css"
export default function AdminLogin(){
    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:5000/api/googleAuth";
    };
    return(
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
}