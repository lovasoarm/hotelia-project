import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [reservationId, setReservationId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchInvoices = async () => {
    try {
      const res = await api.get("/invoices");
      setInvoices(res.data);
    } catch {
      setError("Erreur lors du chargement");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post(`/invoices/generate/${reservationId}`);
      setSuccess("Facture générée");
      setReservationId("");
      fetchInvoices();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur");
    }
  };

  const handlePay = async (id) => {
    setError("");
    setSuccess("");
    try {
      await api.patch(`/invoices/${id}/pay`);
      setSuccess("Facture marquée comme payée");
      fetchInvoices();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur");
    }
  };

  return (
    <div style={styles.page}>
      <div className="page-header">
        <h2>Factures</h2>
      </div>

      {error && <div className="msg-error">{error}</div>}
      {success && <div className="msg-success">{success}</div>}

      <div className="card" style={styles.formCard}>
        <h3 style={styles.formTitle}>Générer une facture</h3>
        <form onSubmit={handleGenerate} style={styles.generateForm}>
          <input
            type="number"
            placeholder="ID de la réservation (COMPLETED)"
            value={reservationId}
            onChange={(e) => setReservationId(e.target.value)}
            style={styles.generateInput}
            required
          />
          <button type="submit" className="btn-primary">
            Générer
          </button>
        </form>
      </div>

      <div className="card">
        {invoices.length === 0 ? (
          <div className="empty-state">
            <p>Aucune facture.</p>
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
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>#{inv.id}</td>
                  <td>{inv.clientName}</td>
                  <td>{inv.roomNumber}</td>
                  <td>{inv.numberOfNights}</td>
                  <td>{inv.totalAmount} Ar</td>
                  <td>{new Date(inv.issueDate).toLocaleDateString("fr-FR")}</td>
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
                        Payer
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
  page: { padding: "32px", maxWidth: "1100px", margin: "0 auto" },
  formCard: { marginBottom: "24px" },
  formTitle: {
    marginBottom: "16px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#1a1a2e",
  },
  generateForm: { display: "flex", gap: "12px", alignItems: "center" },
  generateInput: { maxWidth: "320px" },
};
