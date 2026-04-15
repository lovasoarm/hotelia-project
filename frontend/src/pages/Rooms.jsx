import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "../components/Toast";

export default function Rooms() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [rooms, setRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [form, setForm] = useState({
    roomNumber: "",
    type: "SINGLE",
    pricePerNight: "",
  });
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    try {
      const res = await api.get("/rooms");
      setRooms(res.data);
    } catch {
      toast.error("Erreur lors du chargement");
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    let r = rooms;
    if (filterStatus !== "ALL") r = r.filter((x) => x.status === filterStatus);
    if (search)
      r = r.filter((x) =>
        x.roomNumber.toLowerCase().includes(search.toLowerCase()),
      );
    setFiltered(r);
  }, [rooms, search, filterStatus]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/rooms", {
        ...form,
        pricePerNight: parseFloat(form.pricePerNight),
      });
      toast.success("Chambre créée");
      setForm({ roomNumber: "", type: "SINGLE", pricePerNight: "" });
      setShowForm(false);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/rooms/${id}/status?status=${status}`);
      toast.success("Statut mis à jour");
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette chambre ?")) return;
    try {
      await api.delete(`/rooms/${id}`);
      toast.success("Chambre supprimée");
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const counts = {
    ALL: rooms.length,
    AVAILABLE: rooms.filter((r) => r.status === "AVAILABLE").length,
    OCCUPIED: rooms.filter((r) => r.status === "OCCUPIED").length,
    MAINTENANCE: rooms.filter((r) => r.status === "MAINTENANCE").length,
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">Chambres</h2>
          <p className="page-subtitle">
            {rooms.length} chambre{rooms.length !== 1 ? "s" : ""} au total
          </p>
        </div>
        {isAdmin && (
          <button
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Annuler" : "+ Nouvelle chambre"}
          </button>
        )}
      </div>

      <div style={styles.filterTabs}>
        {[
          { key: "ALL", label: "Toutes" },
          { key: "AVAILABLE", label: "Disponibles" },
          { key: "OCCUPIED", label: "Occupées" },
          { key: "MAINTENANCE", label: "Maintenance" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            style={{
              ...styles.filterTab,
              ...(filterStatus === tab.key ? styles.filterTabActive : {}),
            }}
          >
            {tab.label}
            <span style={styles.filterCount}>{counts[tab.key]}</span>
          </button>
        ))}
      </div>

      {showForm && isAdmin && (
        <div className="card" style={{ marginBottom: "20px", padding: "24px" }}>
          <h3 style={styles.formTitle}>Nouvelle chambre</h3>
          <form onSubmit={handleCreate}>
            <div className="form-grid">
              <div>
                <label className="form-label">Numéro *</label>
                <input
                  placeholder="101"
                  value={form.roomNumber}
                  onChange={(e) =>
                    setForm({ ...form, roomNumber: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="form-label">Type *</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="SINGLE">Single</option>
                  <option value="DOUBLE">Double</option>
                  <option value="SUITE">Suite</option>
                </select>
              </div>
              <div>
                <label className="form-label">Prix / nuit (Ar) *</label>
                <input
                  type="number"
                  placeholder="150000"
                  value={form.pricePerNight}
                  onChange={(e) =>
                    setForm({ ...form, pricePerNight: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn-primary">
                Ajouter
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setShowForm(false)}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="table-toolbar">
          <div className="search-bar">
            <span className="search-icon">⌕</span>
            <input
              placeholder="Numéro de chambre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="table-container">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <h3>Aucune chambre</h3>
              <p>Modifiez les filtres ou créez une chambre</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Numéro</th>
                  <th>Type</th>
                  <th>Prix / nuit</th>
                  <th>Statut</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>#{r.roomNumber}</td>
                    <td>{r.type}</td>
                    <td>{r.pricePerNight.toLocaleString()} Ar</td>
                    <td>
                      <span className={`badge badge-${r.status.toLowerCase()}`}>
                        {r.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                          }}
                        >
                          <select
                            value={r.status}
                            onChange={(e) =>
                              handleStatusChange(r.id, e.target.value)
                            }
                            style={styles.selectInline}
                          >
                            <option value="AVAILABLE">AVAILABLE</option>
                            <option value="OCCUPIED">OCCUPIED</option>
                            <option value="MAINTENANCE">MAINTENANCE</option>
                          </select>
                          <button
                            className="btn-danger btn-sm"
                            onClick={() => handleDelete(r.id)}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  filterTabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  filterTab: {
    background: "var(--surface)",
    color: "var(--text-muted)",
    border: "1px solid var(--border)",
    padding: "7px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
  },
  filterTabActive: {
    background: "var(--accent)",
    color: "#0e0e0e",
    border: "1px solid var(--accent)",
  },
  filterCount: {
    background: "rgba(255,255,255,0.15)",
    borderRadius: "10px",
    padding: "1px 7px",
    fontSize: "11px",
    fontWeight: "700",
  },
  formTitle: { fontSize: "15px", fontWeight: "600", marginBottom: "20px" },
  selectInline: {
    width: "auto",
    padding: "5px 8px",
    fontSize: "12px",
  },
};
