import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Rooms() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    roomNumber: "",
    type: "SINGLE",
    pricePerNight: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/rooms");
      setRooms(res.data);
    } catch {
      setError("Erreur lors du chargement");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/rooms", {
        ...form,
        pricePerNight: parseFloat(form.pricePerNight),
      });
      setSuccess("Chambre créée");
      setForm({ roomNumber: "", type: "SINGLE", pricePerNight: "" });
      setShowForm(false);
      fetchRooms();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/rooms/${id}/status?status=${status}`);
      setSuccess("Statut mis à jour");
      fetchRooms();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette chambre ?")) return;
    try {
      await api.delete(`/rooms/${id}`);
      setSuccess("Chambre supprimée");
      fetchRooms();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur");
    }
  };

  return (
    <div style={styles.page}>
      <div className="page-header">
        <h2>Chambres</h2>
        {isAdmin && (
          <button
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Annuler" : "+ Nouvelle chambre"}
          </button>
        )}
      </div>

      {error && <div className="msg-error">{error}</div>}
      {success && <div className="msg-success">{success}</div>}

      {showForm && isAdmin && (
        <div className="card" style={styles.formCard}>
          <h3 style={styles.formTitle}>Nouvelle chambre</h3>
          <form onSubmit={handleCreate}>
            <div className="form-grid">
              <input
                placeholder="Numéro (ex: 101) *"
                value={form.roomNumber}
                onChange={(e) =>
                  setForm({ ...form, roomNumber: e.target.value })
                }
                required
              />
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="SINGLE">Single</option>
                <option value="DOUBLE">Double</option>
                <option value="SUITE">Suite</option>
              </select>
              <input
                placeholder="Prix par nuit *"
                type="number"
                value={form.pricePerNight}
                onChange={(e) =>
                  setForm({ ...form, pricePerNight: e.target.value })
                }
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Ajouter
            </button>
          </form>
        </div>
      )}

      <div className="card">
        {rooms.length === 0 ? (
          <div className="empty-state">
            <p>Aucune chambre enregistrée.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Type</th>
                <th>Prix/nuit</th>
                <th>Statut</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong>{r.roomNumber}</strong>
                  </td>
                  <td>{r.type}</td>
                  <td>{r.pricePerNight} Ar</td>
                  <td>
                    <span className={`badge badge-${r.status.toLowerCase()}`}>
                      {r.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td style={styles.actions}>
                      <select
                        value={r.status}
                        onChange={(e) =>
                          handleStatusChange(r.id, e.target.value)
                        }
                        style={styles.selectSmall}
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
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "32px", maxWidth: "1100px", margin: "0 auto" },
  formCard: { marginBottom: "24px" },
  formTitle: {
    marginBottom: "16px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#1a1a2e",
  },
  actions: { display: "flex", gap: "8px", alignItems: "center" },
  selectSmall: { width: "auto", padding: "5px 8px", fontSize: "12px" },
};
