import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "../components/Toast";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filterPaid, setFilterPaid] = useState("ALL");
  const [reservationId, setReservationId] = useState("");

  const fetch = async () => {
    try {
      const res = await api.get("/invoices");
      setInvoices(res.data);
    } catch {
      toast.error("Erreur lors du chargement");
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    let r = invoices;
    if (filterPaid === "PAID") r = r.filter((x) => x.isPaid);
    if (filterPaid === "UNPAID") r = r.filter((x) => !x.isPaid);
    if (search)
      r = r.filter((x) =>
        `${x.clientName} ${x.roomNumber}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    setFiltered(r);
  }, [invoices, search, filterPaid]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/invoices/generate/${reservationId}`);
      toast.success("Facture générée");
      setReservationId("");
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const handlePay = async (id) => {
    try {
      await api.patch(`/invoices/${id}/pay`);
      toast.success("Facture marquée comme payée");
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const totalRevenue = invoices
    .filter((i) => i.isPaid)
    .reduce((s, i) => s + i.totalAmount, 0);
  const pending = invoices
    .filter((i) => !i.isPaid)
    .reduce((s, i) => s + i.totalAmount, 0);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">Factures</h2>
          <p className="page-subtitle">
            {invoices.length} facture{invoices.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div style={styles.summaryGrid}>
        <div className="stat-card">
          <div className="stat-value" style={{ color: "var(--success)" }}>
            {totalRevenue.toLocaleString()} Ar
          </div>
          <div className="stat-label">Revenus encaissés</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: "var(--warning)" }}>
            {pending.toLocaleString()} Ar
          </div>
          <div className="stat-label">En attente de paiement</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {invoices.filter((i) => i.isPaid).length}
          </div>
          <div className="stat-label">Factures payées</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "20px", padding: "24px" }}>
        <h3 style={styles.formTitle}>Générer une facture</h3>
        <form onSubmit={handleGenerate} style={styles.generateForm}>
          <div style={{ flex: 1, maxWidth: "320px" }}>
            <label className="form-label">
              ID de la réservation (COMPLETED)
            </label>
            <input
              type="number"
              placeholder="Ex: 3"
              value={reservationId}
              onChange={(e) => setReservationId(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            style={styles.generateBtn}
          >
            Générer
          </button>
        </form>
      </div>

      <div style={styles.filterTabs}>
        {[
          { key: "ALL", label: "Toutes", count: invoices.length },
          {
            key: "PAID",
            label: "Payées",
            count: invoices.filter((i) => i.isPaid).length,
          },
          {
            key: "UNPAID",
            label: "En attente",
            count: invoices.filter((i) => !i.isPaid).length,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterPaid(tab.key)}
            style={{
              ...styles.filterTab,
              ...(filterPaid === tab.key ? styles.filterTabActive : {}),
            }}
          >
            {tab.label}
            <span style={styles.filterCount}>{tab.count}</span>
          </button>
        ))}
      </div>

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
              <h3>Aucune facture</h3>
              <p>Générez une facture depuis une réservation terminée</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Client</th>
                  <th>Chambre</th>
                  <th>Nuits</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr key={inv.id}>
                    <td style={{ color: "var(--text-muted)", fontWeight: 500 }}>
                      #{inv.id}
                    </td>
                    <td style={{ fontWeight: 500 }}>{inv.clientName}</td>
                    <td>#{inv.roomNumber}</td>
                    <td>{inv.numberOfNights}j</td>
                    <td style={{ fontWeight: 600 }}>
                      {inv.totalAmount?.toLocaleString()} Ar
                    </td>
                    <td style={{ color: "var(--text-muted)" }}>
                      {new Date(inv.issueDate).toLocaleDateString("fr-FR")}
                    </td>
                    <td>
                      <span
                        className={`badge ${inv.isPaid ? "badge-paid" : "badge-unpaid"}`}
                      >
                        {inv.isPaid ? "PAYÉE" : "EN ATTENTE"}
                      </span>
                    </td>
                    <td>
                      {!inv.isPaid && (
                        <button
                          className="btn-success btn-sm"
                          onClick={() => handlePay(inv.id)}
                        >
                          Marquer payée
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
    </div>
  );
}

const styles = {
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  formTitle: { fontSize: "15px", fontWeight: "600", marginBottom: "16px" },
  generateForm: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-end",
    flexWrap: "wrap",
  },
  generateBtn: {
    marginBottom: "0",
    whiteSpace: "nowrap",
    alignSelf: "flex-end",
  },
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
};
