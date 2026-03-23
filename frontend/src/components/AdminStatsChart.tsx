"use client";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function AdminStatsChart({ stats }: any) {
  const data = {
    labels: ["Collected", "Pending", "Flats"],
    datasets: [
      {
        label: "Society Stats",
        data: [
          stats.total_collected,
          stats.total_pending,
          stats.total_flats
        ],
        backgroundColor: ["#10b981", "#ef4444", "#3b82f6"]
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", color:"#0f172a"}}>
      <h3>Overview</h3>
      <Bar data={data} options={options} />
    </div>
  );
}