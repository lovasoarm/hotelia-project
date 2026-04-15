import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "../components/Toast";

export default function Clients() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [clients, setClients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const res = await api.get("/clients");
      setClients(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      clients.filter((c) =>
        `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(q),
      ),
    );
  }, [search, clients]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/clients", form);
      toast.success("Client créé");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
      });
      setShowForm(false);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce client ?")) return;
    try {
      await api.delete(`/clients/${id}`);
      toast.success("Client supprimé");
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">Clients</h2>
          <p className="page-subtitle">
            {clients.length} client{clients.length !== 1 ? "s" : ""} enregistré
            {clients.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Annuler" : "+ Nouveau client"}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: "20px", padding: "24px" }}>
          <h3 style={styles.formTitle}>Nouveau client</h3>
          <form onSubmit={handleCreate}>
            <div className="form-grid">
              <div>
                <label className="form-label">Prénom *</label>
                <input
                  placeholder="Jean"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="form-label">Nom *</label>
                <input
                  placeholder="Dupont"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  placeholder="jean@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="form-label">Téléphone</label>
                <input
                  placeholder="+261 34 00 000 00"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Adresse</label>
                <input
                  placeholder="Antananarivo"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn-primary">
                Créer le client
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
              placeholder="Rechercher un client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="table-container">
          {loading ? (
            <div className="empty-state">
              <p>Chargement...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <h3>Aucun client trouvé</h3>
              <p>Essayez un autre terme de recherche</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nom complet</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Adresse</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>
                      {c.firstName} {c.lastName}
                    </td>
                    <td style={{ color: "var(--text-muted)" }}>{c.email}</td>
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
    </div>
  );
}

const styles = {
  formTitle: {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "var(--text)",
  },
};
