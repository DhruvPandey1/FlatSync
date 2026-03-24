"use client";
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import styles from './ProfileForm.module.css';

export default function ProfileForm({ initialData }: any) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialData?.full_name || '',
    email: initialData?.email || '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/update-profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials:"include",
      body: JSON.stringify({ name: formData.name, newPassword: formData.newPassword })
    });

    if (res.ok) {
        toast.success("Profile updated successfully!");
        router.refresh();
    } else toast.error("Failed to update profile.");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.section}>
        <h3>Personal Information</h3>
        <div className={styles.inputGroup}>
          <label>Full Name</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Email Address</label>
          <input type="email" value={formData.email} disabled className={styles.disabled} />
          <small>Email cannot be changed.</small>
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.section}>
        <h3>Security</h3>
        <div className={styles.inputGroup}>
          <label>New Password (Optional)</label>
          <input 
            type="password" 
            onChange={(e) => setFormData({...formData, newPassword: e.target.value})} 
            placeholder="Leave blank to keep current password"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Confirm New Password</label>
          <input 
            type="password" 
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
          />
        </div>
      </div>

      <button type="submit" className={styles.saveBtn}>Update Profile</button>
    </form>
  );
}