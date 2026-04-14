import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <span style={styles.logo}>H</span>
        <span style={styles.brandName}>HOTELIA</span>
      </div>

      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>
          Dashboard
        </Link>
        <Link to="/clients" style={styles.link}>
          Clients
        </Link>
        <Link to="/rooms" style={styles.link}>
          Chambres
        </Link>
        <Link to="/reservations" style={styles.link}>
          Réservations
        </Link>
        <Link to="/invoices" style={styles.link}>
          Factures
        </Link>
      </div>

      <div style={styles.right}>
        <span style={styles.userInfo}>
          {user?.username} · <span style={styles.role}>{user?.role}</span>
        </span>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Déconnexion
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "#1a1a2e",
    color: "#fff",
    padding: "0 32px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logo: {
    background: "#e94560",
    color: "#fff",
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "16px",
  },
  brandName: {
    fontWeight: "700",
    fontSize: "16px",
    letterSpacing: "2px",
  },
  links: {
    display: "flex",
    gap: "8px",
  },
  link: {
    color: "rgba(255,255,255,0.75)",
    padding: "6px 14px",
    borderRadius: "6px",
    fontSize: "13px",
    transition: "all 0.2s",
    textDecoration: "none",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  userInfo: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.7)",
  },
  role: {
    color: "#e94560",
    fontWeight: "600",
  },
  logoutBtn: {
    background: "rgba(233,69,96,0.15)",
    color: "#e94560",
    border: "1px solid rgba(233,69,96,0.3)",
    padding: "6px 14px",
    borderRadius: "6px",
    fontSize: "13px",
    cursor: "pointer",
  },
};
