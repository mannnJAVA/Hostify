// client/src/pages/Hostels.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import HostelCard from "../components/HostelCard";

export default function Hostels() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    sharing: "",
    ac: "",
    price: "",
  });

  async function loadListings() {
    setErr("");
    setLoading(true);
    try {
      const res = await api.get("/listings?limit=24");
      setListings(res.data.items || []);
    } catch (e) {
      console.error("Failed to load listings", e);
      setErr(e.response?.data?.message || "Unable to load hostels");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadListings();
  }, []);

  if (loading) return <div className="p-8">Loading hostels…</div>;
  if (err) return <div className="p-8 text-red-700">Error: {err}</div>;
  if (!listings.length)
    return <div className="p-8">No hostels found. Add one from admin.</div>;

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Hostels & PGs</h1>
        <p className="text-sm text-gray-600">
          Find places as per your preference.
        </p>
      </header>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="City (e.g., Pune)"
          className="border p-2 rounded w-40"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        />

        <select
          className="border p-2 rounded"
          value={filters.sharing}
          onChange={(e) => setFilters({ ...filters, sharing: e.target.value })}
        >
          <option value="">Sharing</option>
          <option value="1">1 Sharing</option>
          <option value="2">2 Sharing</option>
          <option value="3">3 Sharing</option>
          <option value="4">4 Sharing</option>
        </select>

        <select
          className="border p-2 rounded"
          value={filters.ac}
          onChange={(e) => setFilters({ ...filters, ac: e.target.value })}
        >
          <option value="">AC / Non AC</option>
          <option value="true">AC</option>
          <option value="false">Non AC</option>
        </select>

        <input
          type="number"
          placeholder="Max Price"
          className="border p-2 rounded w-32"
          value={filters.price}
          onChange={(e) => setFilters({ ...filters, price: e.target.value })}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={applyFilters}
        >
          Apply
        </button>

        <button className="border px-4 py-2 rounded" onClick={resetFilters}>
          Reset
        </button>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((l) => (
          <HostelCard
            key={l._id}
            listing={l}
            onContact={() => alert("Contact flow coming soon")}
            onSave={() => alert("Saved")}
          />
        ))}
      </section>
    </main>
  );
}
