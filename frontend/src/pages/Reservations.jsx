import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [clients, setClients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    clientId: "",
    roomId: "",
    checkInDate: "",
    checkOutDate: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
      setError("Erreur lors du chargement");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/reservations", {
        ...form,
        clientId: parseInt(form.clientId),
        roomId: parseInt(form.roomId),
      });
      setSuccess("Réservation créée");
      setForm({ clientId: "", roomId: "", checkInDate: "", checkOutDate: "" });
      setShowForm(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur");
    }
  };

  const handleAction = async (id, action) => {
    setError("");
    setSuccess("");
    try {
      await api.patch(`/reservations/${id}/${action}`);
      setSuccess(
        `Réservation ${action === "confirm" ? "confirmée" : action === "cancel" ? "annulée" : "terminée"}`,
      );
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur");
    }
  };

  return (
    <div style={styles.page}>
      <div className="page-header">
        <h2>Réservations</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Annuler" : "+ Nouvelle réservation"}
        </button>
      </div>

      {error && <div className="msg-error">{error}</div>}
      {success && <div className="msg-success">{success}</div>}

      {showForm && (
        <div className="card" style={styles.formCard}>
          <h3 style={styles.formTitle}>Nouvelle réservation</h3>
          <form onSubmit={handleCreate}>
            <div className="form-grid">
              <select
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                required
              >
                <option value="">-- Client --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName}
                  </option>
                ))}
              </select>
              <select
                value={form.roomId}
                onChange={(e) => setForm({ ...form, roomId: e.target.value })}
                required
              >
                <option value="">-- Chambre --</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.roomNumber} — {r.type} — {r.pricePerNight} Ar
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={form.checkInDate}
                onChange={(e) =>
                  setForm({ ...form, checkInDate: e.target.value })
                }
                required
              />
              <input
                type="date"
                value={form.checkOutDate}
                onChange={(e) =>
                  setForm({ ...form, checkOutDate: e.target.value })
                }
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Réserver
            </button>
          </form>
        </div>
      )}

      <div className="card">
        {reservations.length === 0 ? (
          <div className="empty-state">
            <p>Aucune réservation.</p>
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
              {reservations.map((r) => (
                <tr key={r.id}>
                  <td>{r.clientName}</td>
                  <td>{r.roomNumber}</td>
                  <td>{r.checkInDate}</td>
                  <td>{r.checkOutDate}</td>
                  <td>{r.numberOfNights}</td>
                  <td>{r.totalAmount} Ar</td>
                  <td>
                    <span className={`badge badge-${r.status.toLowerCase()}`}>
                      {r.status}
                    </span>
                  </td>
                  <td style={styles.actions}>
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
                        className="btn-secondary btn-sm"
                        onClick={() => handleAction(r.id, "complete")}
                      >
                        Terminer
                      </button>
                    )}
                    {(r.status === "PENDING" || r.status === "CONFIRMED") && (
                      <button
                        className="btn-danger btn-sm"
                        onClick={() => handleAction(r.id, "cancel")}
                      >
                        Annuler
                      </button>
                    )}
                  </td>
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
  page: { padding: "32px", maxWidth: "1200px", margin: "0 auto" },
  formCard: { marginBottom: "24px" },
  formTitle: {
    marginBottom: "16px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#1a1a2e",
  },
  actions: { display: "flex", gap: "6px", flexWrap: "wrap" },
};
