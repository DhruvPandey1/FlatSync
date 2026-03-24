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
    router.refresh();
  };

  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' },
    { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];

  const currentYearNum = new Date().getFullYear();
  const years = [currentYearNum - 1, currentYearNum, currentYearNum + 1, currentYearNum + 2];


  return (
    <div className={styles.container}>
      <div className={styles.filterBar}>
        <select name="month" value={currentMonth} onChange={handleFilterChange}>
          {months.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>

        <select name="year" value={currentYear} onChange={handleFilterChange}>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
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
          {records && records.length > 0 ? (
            records.map((record: any, index: any) => (
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
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>
                No data available for this month.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}