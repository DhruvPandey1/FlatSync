"use client";

import { useState } from 'react';
import styles from './CreateUserModal.module.css';

export default function CreateUserModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'RESIDENT',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:"include",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        const userId = data.user?.id || 'Unknown';
        setMessage({ text: `User created successfully! ID: ${userId}. Please create their flat.`, type: 'success' });
        setFormData({ name: '', email: '', role: 'RESIDENT' });
        setTimeout(() => setIsOpen(false), 5000);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setMessage({ text: errorData.detail || 'Failed to create user', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'An unexpected error occurred', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        className={styles.triggerButton} 
        onClick={() => setIsOpen(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.buttonIcon}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Create New User
      </button>

      {isOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Create New User</h2>
              <button className={styles.closeButton} onClick={() => setIsOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.formContainer}>
              <div className={styles.inputGroup}>
                <label>Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
              </div>

              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
              </div>

              <div className={styles.inputGroup}>
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange} required>
                  <option value="RESIDENT">Resident</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              {message.text && (
                <div className={`${styles.message} ${message.type === 'error' ? styles.errorMessage : styles.successMessage}`}>
                  {message.text}
                </div>
              )}

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelButton} onClick={() => setIsOpen(false)}>Cancel</button>
                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
