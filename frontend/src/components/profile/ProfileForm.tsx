"use client";

import { useState } from 'react';
import styles from './ProfileForm.module.css';
import { updateProfile } from '@/app/actions/userActions';
import { logoutAction } from '@/app/actions/auth';
import toast from 'react-hot-toast';

export default function ProfileForm({initialData}:{initialData:any}){
    const [isEditing,setIsEditing]=useState(false);

    

    return(
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2>Personal Information</h2>
                <button
                    className={styles.editBtn}
                    onClick={()=>setIsEditing(!isEditing)}
                >
                    {isEditing?'Cancel':'Edit Info'}
                </button>
            </div>
            <form action={
                async (formData)=>{
                    const result = await updateProfile(formData,initialData);
                    if (result.error) {
                        toast.error(result.error);
                    } else {
                        toast.success("Profile updated successfully!");
                        setIsEditing(false);
                    }
                }
            }>
                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <label htmlFor="name">Full Name</label>
                        {
                            isEditing?(
                                <input type="text" name='name' id='name' defaultValue={initialData?.full_name} className={styles.input} />
                            ):(
                                <p>{initialData?.full_name}</p>
                            )
                        }
                    </div>
                    <div className={styles.infoItem}>
                        <label htmlFor="email">Email Address</label>
                        {
                            isEditing?(
                                <input type="email" name='email' id='email' defaultValue={initialData?.email} className={styles.input} />
                            ):(
                                <p>{initialData?.email}</p>
                            )
                        }
                    </div>
                    
                    {isEditing && (
                        <div className={styles.infoItem}>
                            <label htmlFor="password">Update Password</label>
                            <input type="password" name='password' id='password' placeholder='New Password' className={styles.input}/>
                        </div>
                    )}
                </div>
                {isEditing&&(
                    <button type='submit' className={styles.saveBtn}>Save Changes</button>
                )}   
            </form>


        </div>
        
    )
}