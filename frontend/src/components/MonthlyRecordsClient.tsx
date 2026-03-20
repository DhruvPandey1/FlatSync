"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/MonthlyRecords.module.css';

export default function MonthlyRecordsClient({ records, currentMonth, currentYear }: any) {
  const router = useRouter();

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(window.location.search);
    params.set(name, value);
    router.push(`?${params.toString()}`);
  };


  return (
    <div className={styles.container}>
      <div className={styles.filterBar}>
        <select name="month" value={currentMonth} onChange={handleFilterChange}>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
        </select>

        <select name="year" value={currentYear} onChange={handleFilterChange}>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Flat No</th>
            <th>Owner</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record: any,index:any) => (
            <tr key={index}>
              <td>{record.flat_number}</td>
              <td>{record.full_name}</td>
              <td>₹{record.amount_due}</td>
              <td>
                <span className={record.status === 'PAID' ? styles.paid : styles.pending}>
                  {record.status}
                </span>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}