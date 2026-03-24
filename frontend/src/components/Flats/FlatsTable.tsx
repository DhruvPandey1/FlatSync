"use client";
import { useState, useEffect } from "react";
import styles from "@/styles/FlatsTable.module.css";
import AddEditFlatModal from "./AddEditFlatModal";
import { Button } from "@/components/ui/Button";

export default function FlatsTable({ initialData = [] }: { initialData: any[] }) {
  const [flats, setFlats] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [wing, setWing] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchFlats = async () => {
    let endpoint = `${process.env.NEXT_PUBLIC_API_URL}/admin/flats`;
    if (searchTerm || wing) {
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/admin/search-flats?q=${searchTerm}&wing=${wing}`;
    }

    const res = await fetch(endpoint, {
        credentials:"include"
    });
    const data = await res.json();
    setFlats(Array.isArray(data) ? data : []);
    setCurrentPage(1);
  };

  useEffect(() => {
    const timer = setTimeout(fetchFlats, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, wing]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this flat?")) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/flats/${id}`, { method: 'DELETE' ,credentials:"include"});
    if (res.ok) fetchFlats();
  };

  const openEditModal = (flat: any) => {
    setEditData(flat);
    setIsModalOpen(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = flats.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(flats.length / itemsPerPage);

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <div className={styles.filters}>
          <input 
            type="text" placeholder="Search..." 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
            className={styles.searchInput}
          />
          <select value={wing} onChange={(e) => setWing(e.target.value)} className={styles.selectInput}>
            <option value="">All Wings</option>
            <option value="A">Wing A</option>
            <option value="B">Wing B</option>
            <option value="C">Wing C</option>
          </select>
        </div>
        <Button className={styles.addBtn} onClick={() => { setEditData(null); setIsModalOpen(true); }}>
          + Add New Flat
        </Button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Flat No</th>
            <th>Wing</th>
            <th>Owner</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((flat: any) => (
              <tr key={flat.id}>
                <td>{flat.flat_number}</td>
                <td>{flat.wing}</td>
                <td>{flat.full_name}</td>
                <td className={styles.actions}>
                  <Button size="sm" variant="outline" onClick={() => openEditModal(flat)} className={styles.editBtn}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(flat.id)} className={styles.deleteBtn}>Delete</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>No flats found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <Button disabled={currentPage === 1} variant="secondary" onClick={() => setCurrentPage(p => p - 1)}>Prev</Button>
        <span>Page {currentPage} of {totalPages || 1}</span>
        <Button disabled={currentPage === totalPages || totalPages === 0} variant="secondary" onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
      </div>

      <AddEditFlatModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editData={editData} 
        refreshData={fetchFlats} 
      />
    </div>
  );
}
