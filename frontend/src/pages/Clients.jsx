import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Clients() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchClients = async () => {
    try {
      const res = await api.get("/clients");
      setClients(res.data);
    } catch {
      setError("Erreur lors du chargement");
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/clients", form);
      setSuccess("Client créé avec succès");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
      });
      setShowForm(false);
      fetchClients();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce client ?")) return;
    try {
      await api.delete(`/clients/${id}`);
      setSuccess("Client supprimé");
      fetchClients();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur");
    }
  };

  return (
    <div style={styles.page}>
      <div className="page-header">
        <h2>Clients</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Annuler" : "+ Nouveau client"}
        </button>
      </div>

      {error && <div className="msg-error">{error}</div>}
      {success && <div className="msg-success">{success}</div>}

      {showForm && (
        <div className="card" style={styles.formCard}>
          <h3 style={styles.formTitle}>Nouveau client</h3>
          <form onSubmit={handleCreate}>
            <div className="form-grid">
              <input
                placeholder="Prénom *"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                required
              />
              <input
                placeholder="Nom *"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
              <input
                placeholder="Email *"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                placeholder="Téléphone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                placeholder="Adresse"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary">
              Créer
            </button>
          </form>
        </div>
      )}

      <div className="card">
        {clients.length === 0 ? (
          <div className="empty-state">
            <p>Aucun client enregistré.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Adresse</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td>
                    {c.firstName} {c.lastName}
                  </td>
                  <td>{c.email}</td>
                  <td>{c.phone || "—"}</td>
                  <td>{c.address || "—"}</td>
                  {isAdmin && (
                    <td>
                      <button
                        className="btn-danger btn-sm"
                        onClick={() => handleDelete(c.id)}
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
};
