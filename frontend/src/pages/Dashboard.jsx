import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const navCards = [
  {
    label: "Clients",
    path: "/clients",
    desc: "Gérer la base clients",
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&auto=format&fit=crop&q=60",
  },
  {
    label: "Chambres",
    path: "/rooms",
    desc: "Disponibilités et statuts",
    img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=60",
  },
  {
    label: "Réservations",
    path: "/reservations",
    desc: "Créer et suivre",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=60",
  },
  {
    label: "Factures",
    path: "/invoices",
    desc: "Génération et paiements",
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=60",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get("/stats")
      .then((r) => setStats(r.data))
      .catch(() => {});
  }, []);

  const statItems = stats
    ? [
        { label: "Clients", value: stats.totalClients },
        {
          label: "Chambres disponibles",
          value: `${stats.availableRooms}/${stats.totalRooms}`,
        },
        { label: "Réservations en attente", value: stats.pendingReservations },
        { label: "Confirmées", value: stats.confirmedReservations },
        { label: "Factures", value: stats.totalInvoices },
        {
          label: "Revenus encaissés",
          value: `${stats.totalRevenue.toLocaleString()} Ar`,
        },
      ]
    : [];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Tableau de bord</p>
          <h1 style={styles.title}>Bonjour, {user?.username}</h1>
          <p style={styles.sub}>
            {user?.role === "ADMIN"
              ? "Accès administrateur complet"
              : "Accès réceptionniste"}
          </p>
        </div>
      </div>

      {stats && (
        <div style={styles.statsGrid}>
          {statItems.map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={styles.divider} />

      <div style={styles.cardsGrid}>
        {navCards.map((card) => (
          <div
            key={card.path}
            style={styles.card}
            onClick={() => navigate(card.path)}
          >
            <img src={card.img} alt={card.label} style={styles.cardImg} />
            <div style={styles.cardOverlay} />
            <div style={styles.cardContent}>
              <div style={styles.cardLabel}>{card.label}</div>
              <div style={styles.cardDesc}>{card.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "40px 32px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "32px",
  },
  eyebrow: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "2px",
    color: "var(--accent)",
    marginBottom: "8px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "var(--text)",
    marginBottom: "4px",
  },
  sub: {
    fontSize: "13px",
    color: "var(--text-muted)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "16px",
    marginBottom: "32px",
  },
  divider: {
    height: "1px",
    background: "var(--border)",
    marginBottom: "32px",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  },
  card: {
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    height: "200px",
    cursor: "pointer",
    border: "1px solid var(--border)",
    transition: "transform 0.2s, border-color 0.2s",
  },
  cardImg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s",
  },
  cardOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%)",
    zIndex: 1,
  },
  cardContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "20px",
    zIndex: 2,
  },
  cardLabel: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "4px",
  },
  cardDesc: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.6)",
  },
};
