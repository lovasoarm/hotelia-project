import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "../components/Toast";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [clients, setClients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [form, setForm] = useState({
    clientId: "",
    roomId: "",
    checkInDate: "",
    checkOutDate: "",
  });
  const [showForm, setShowForm] = useState(false);

  const fetchAll = async () => {
    try {
      const [r, c, rm] = await Promise.all([
        api.get("/reservations"),
        api.get("/clients"),
        api.get("/rooms"),
      ]);
      setReservations(r.data);
      setClients(c.data);
      setRooms(rm.data);
    } catch {
      toast.error("Erreur lors du chargement");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    let r = reservations;
    if (filterStatus !== "ALL") r = r.filter((x) => x.status === filterStatus);
    if (search)
      r = r.filter((x) =>
        `${x.clientName} ${x.roomNumber}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    setFiltered(r);
  }, [reservations, search, filterStatus]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reservations", {
        ...form,
        clientId: parseInt(form.clientId),
        roomId: parseInt(form.roomId),
      });
      toast.success("Réservation créée");
      setForm({ clientId: "", roomId: "", checkInDate: "", checkOutDate: "" });
      setShowForm(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.patch(`/reservations/${id}/${action}`);
      const labels = {
        confirm: "confirmée",
        cancel: "annulée",
        complete: "terminée",
      };
      toast.success(`Réservation ${labels[action]}`);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const counts = {
    ALL: reservations.length,
    PENDING: reservations.filter((r) => r.status === "PENDING").length,
    CONFIRMED: reservations.filter((r) => r.status === "CONFIRMED").length,
    COMPLETED: reservations.filter((r) => r.status === "COMPLETED").length,
    CANCELLED: reservations.filter((r) => r.status === "CANCELLED").length,
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">Réservations</h2>
          <p className="page-subtitle">
            {reservations.length} réservation
            {reservations.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Annuler" : "+ Nouvelle réservation"}
        </button>
      </div>

      <div style={styles.filterTabs}>
        {[
          { key: "ALL", label: "Toutes" },
          { key: "PENDING", label: "En attente" },
          { key: "CONFIRMED", label: "Confirmées" },
          { key: "COMPLETED", label: "Terminées" },
          { key: "CANCELLED", label: "Annulées" },
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

      {showForm && (
        <div className="card" style={{ marginBottom: "20px", padding: "24px" }}>
          <h3 style={styles.formTitle}>Nouvelle réservation</h3>
          <form onSubmit={handleCreate}>
            <div className="form-grid">
              <div>
                <label className="form-label">Client *</label>
                <select
                  value={form.clientId}
                  onChange={(e) =>
                    setForm({ ...form, clientId: e.target.value })
                  }
                  required
                >
                  <option value="">Sélectionner...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Chambre *</label>
                <select
                  value={form.roomId}
                  onChange={(e) => setForm({ ...form, roomId: e.target.value })}
                  required
                >
                  <option value="">Sélectionner...</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      #{r.roomNumber} — {r.type} —{" "}
                      {r.pricePerNight.toLocaleString()} Ar
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Arrivée *</label>
                <input
                  type="date"
                  value={form.checkInDate}
                  onChange={(e) =>
                    setForm({ ...form, checkInDate: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="form-label">Départ *</label>
                <input
                  type="date"
                  value={form.checkOutDate}
                  onChange={(e) =>
                    setForm({ ...form, checkOutDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn-primary">
                Créer la réservation
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
              placeholder="Client ou chambre..."
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
              <h3>Aucune réservation</h3>
              <p>Créez votre première réservation</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Chambre</th>
                  <th>Arrivée</th>
                  <th>Départ</th>
                  <th>Nuits</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500 }}>{r.clientName}</td>
                    <td>#{r.roomNumber}</td>
                    <td style={{ color: "var(--text-muted)" }}>
                      {r.checkInDate}
                    </td>
                    <td style={{ color: "var(--text-muted)" }}>
                      {r.checkOutDate}
                    </td>
                    <td>{r.numberOfNights}j</td>
                    <td style={{ fontWeight: 600 }}>
                      {r.totalAmount?.toLocaleString()} Ar
                    </td>
                    <td>
                      <span className={`badge badge-${r.status.toLowerCase()}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          flexWrap: "wrap",
                        }}
                      >
                        {r.status === "PENDING" && (
                          <button
                            className="btn-success btn-sm"
                            onClick={() => handleAction(r.id, "confirm")}
                          >
                            Confirmer
                          </button>
                        )}
                        {r.status === "CONFIRMED" && (
                          <button
                            className="btn-warning btn-sm"
                            onClick={() => handleAction(r.id, "complete")}
                          >
                            Terminer
                          </button>
                        )}
                        {(r.status === "PENDING" ||
                          r.status === "CONFIRMED") && (
                          <button
                            className="btn-danger btn-sm"
                            onClick={() => handleAction(r.id, "cancel")}
                          >
                            Annuler
                          </button>
                        )}
                      </div>
                    </td>
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
};
