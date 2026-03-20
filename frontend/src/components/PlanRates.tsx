"use client";
import { useState } from "react";
import styles from "@/styles/PlanRates.module.css";

export default function PlanRates({ initialPlans }: { initialPlans: any[] }) {
  const [plans, setPlans] = useState(initialPlans);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempRate, setTempRate] = useState("");

  const [isAdding, setIsAdding] = useState(false);
  const [newPlan, setNewPlan] = useState({ name: "", rate: "" });

  const handleUpdate = async (id: number) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/update-plan-rate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' ,"x-role":"ADMIN"},
        body: JSON.stringify({ type_id: id, new_rate: Number(tempRate) })
      });
      if (res.ok) {
        setPlans(plans.map(p => p.id === id ? { ...p, monthly_rate: tempRate } : p));
        setEditingId(null);
      }
    } catch (err) { alert("Update failed"); }
  };

  const handleAddPlan = async () => {
    if (!newPlan.name || !newPlan.rate) return alert("Fill all fields");
    try {
      const res = await fetch('http://localhost:5000/api/admin/add-plan-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' ,"x-role":"ADMIN"},
        body: JSON.stringify({ name: newPlan.name, monthly_rate: Number(newPlan.rate) })
      });
      if (res.ok) {
        const added = await res.json();
        setPlans([...plans, added]);
        setIsAdding(false);
        setNewPlan({ name: "", rate: "" });
      }
    } catch (err) { alert("Error adding plan"); }
  };

  return (
    <div className={styles.grid}>
      {plans.map((plan) => (
        <div key={plan.id} className={styles.planCard}>
          <div className={styles.details}>
            <span className={styles.planLabel}>Flat Type</span>
            <h3>{plan.name}</h3>
            
            {editingId === plan.id ? (
              <div className={styles.editActions}>
                <input 
                  type="number" 
                  value={tempRate} 
                  onChange={(e) => setTempRate(e.target.value)}
                  className={styles.miniInput}
                />
                <button onClick={() => handleUpdate(plan.id)} className={styles.saveBtn}>Save</button>
                <button onClick={() => setEditingId(null)} className={styles.cancelBtn}>×</button>
              </div>
            ) : (
              <div className={styles.viewActions}>
                <span className={styles.amount}>₹{plan.monthly_rate}<span>/mo</span></span>
                <button 
                  onClick={() => { setEditingId(plan.id); setTempRate(plan.monthly_rate); }}
                  className={styles.editBtn}
                >
                  Edit Rate
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className={`${styles.planCard} ${isAdding ? styles.addingCard : styles.addPlaceholder}`}>
        {isAdding ? (
          <div className={styles.addForm}>
            <input 
              placeholder="Name (e.g. 4BHK)" 
              value={newPlan.name}
              onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
            />
            <input 
              type="number" 
              placeholder="Monthly Rate" 
              value={newPlan.rate}
              onChange={(e) => setNewPlan({...newPlan, rate: e.target.value})}
            />
            <div className={styles.addButtons}>
              <button onClick={handleAddPlan} className={styles.confirmAdd}>Create Plan</button>
              <button onClick={() => setIsAdding(false)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className={styles.trigger} onClick={() => setIsAdding(true)}>
            <span className={styles.plus}>+</span>
            <p>Add New Plan Type</p>
          </div>
        )}
      </div>
    </div>
  );
}