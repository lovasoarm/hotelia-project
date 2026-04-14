import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const cards = [
  { label: "Clients", icon: "👤", path: "/clients", desc: "Gérer les clients" },
  { label: "Chambres", icon: "🏨", path: "/rooms", desc: "Gérer les chambres" },
  {
    label: "Réservations",
    icon: "📅",
    path: "/reservations",
    desc: "Gérer les réservations",
  },
  {
    label: "Factures",
    icon: "🧾",
    path: "/invoices",
    desc: "Gérer les factures",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.welcome}>
        <h2 style={styles.title}>Bonjour, {user?.username} 👋</h2>
        <p style={styles.sub}>
          {user?.role === "ADMIN"
            ? "Accès administrateur complet"
            : "Accès réceptionniste"}
        </p>
      </div>

      <div style={styles.grid}>
        {cards.map((card) => (
          <div
            key={card.path}
            style={styles.card}
            onClick={() => navigate(card.path)}
          >
            <div style={styles.icon}>{card.icon}</div>
            <div style={styles.cardLabel}>{card.label}</div>
            <div style={styles.cardDesc}>{card.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "40px 32px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  welcome: {
    marginBottom: "36px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: "6px",
  },
  sub: {
    color: "#888",
    fontSize: "14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "28px 24px",
    cursor: "pointer",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    transition: "transform 0.2s, box-shadow 0.2s",
    border: "1px solid #f0f0f0",
  },
  icon: {
    fontSize: "32px",
    marginBottom: "14px",
  },
  cardLabel: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1a1a2e",
    marginBottom: "6px",
  },
  cardDesc: {
    fontSize: "13px",
    color: "#888",
  },
};
