"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/FlatModal.module.css";
import { Button } from "@/components/ui/Button";

export default function AddEditFlatModal({ isOpen, onClose, editData, refreshData }: any) {
  const router = useRouter();
  const [form, setForm] = useState({ flat_number: "", wing: "", owner_id: "", type_id: "" });

  useEffect(() => {
    if (editData) setForm(editData);
    else setForm({ flat_number: "", wing: "", owner_id: "", type_id: "" });
  }, [editData, isOpen]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const method = editData ? 'PUT' : 'POST';
    const endpoint = editData ? `/admin/edit-flat/${editData.id}` : '/admin/add-flats';
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials:"include",
      body: JSON.stringify(form)
    });

    if (res.ok) {
      refreshData();
      router.refresh(); // Refresh stats cards
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{editData ? "Edit Flat" : "Add New Flat"}</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input type="text" placeholder="Flat Number" value={form.flat_number || ''} onChange={e => setForm({...form, flat_number: e.target.value})} />
            <input type="text" placeholder="Wing" value={form.wing || ''} onChange={e => setForm({...form, wing: e.target.value})} />
            <input type="text" placeholder="Owner ID" value={form.owner_id || ''} onChange={e => setForm({...form, owner_id: e.target.value})} />
            <input type="number" placeholder="Plan Type ID" value={form.type_id || ''} onChange={e => setForm({...form, type_id: e.target.value})} />
          </div>
          <div className={styles.btns}>
             <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
             <Button type="submit" className={styles.primary}>Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
