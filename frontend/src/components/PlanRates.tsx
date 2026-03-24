"use client";
import { useState } from "react";
import toast from 'react-hot-toast';
import styles from "@/styles/PlanRates.module.css";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function PlanRates({ initialPlans }: { initialPlans: any[] }) {
  const [plans, setPlans] = useState(initialPlans);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempRate, setTempRate] = useState("");

  const [isAdding, setIsAdding] = useState(false);
  const [newPlan, setNewPlan] = useState({ name: "", rate: "" });

  const handleUpdate = async (id: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/update-plan-rate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        credentials:"include",
        body: JSON.stringify({ type_id: id, new_rate: Number(tempRate) })
      });
      if (res.ok) {
        setPlans(plans.map(p => p.id === id ? { ...p, monthly_rate: tempRate } : p));
        setEditingId(null);
        toast.success("Rate updated");
      } else {
        toast.error("Update failed");
      }
    } catch (err) { toast.error("Update failed"); }
  };

  const handleAddPlan = async () => {
    if (!newPlan.name || !newPlan.rate) {
      toast.error("Fill all fields");
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/add-plan-type`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        credentials:"include",
        body: JSON.stringify({ name: newPlan.name, monthly_rate: Number(newPlan.rate) })
      });
      if (res.ok) {
        const added = await res.json();
        setPlans([...plans, added]);
        setIsAdding(false);
        setNewPlan({ name: "", rate: "" });
        toast.success("Plan added");
      } else {
        toast.error("Error adding plan");
      }
    } catch (err) { toast.error("Error adding plan"); }
  };

  return (
    <div className={styles.grid}>
      {plans.length === 0 && (
        <Card className={styles.planCard} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <p>No plans available.</p>
        </Card>
      )}
      {plans.map((plan) => (
        <Card key={plan.id} className={styles.planCard}>
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
                <Button size="sm" onClick={() => handleUpdate(plan.id)} className={styles.saveBtn}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className={styles.cancelBtn}>×</Button>
              </div>
            ) : (
              <div className={styles.viewActions}>
                <span className={styles.amount}>₹{plan.monthly_rate}<span>/mo</span></span>
                <Button 
                  size="sm"
                  onClick={() => { setEditingId(plan.id); setTempRate(plan.monthly_rate); }}
                  className={styles.editBtn}
                >
                  Edit Rate
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}

      <Card className={`${styles.planCard} ${isAdding ? styles.addingCard : styles.addPlaceholder}`}>
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
              <Button onClick={handleAddPlan} className={styles.confirmAdd}>Create Plan</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)} className={styles.cancelBtn}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className={styles.trigger} onClick={() => setIsAdding(true)}>
            <span className={styles.plus}>+</span>
            <p>Add New Plan Type</p>
          </div>
        )}
      </Card>
    </div>
  );
}