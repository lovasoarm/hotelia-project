import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/clients", label: "Clients" },
  { path: "/rooms", label: "Chambres" },
  { path: "/reservations", label: "Réservations" },
  { path: "/invoices", label: "Factures" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <div style={styles.brand}>
          <span style={styles.brandName}>HOTELIA</span>
        </div>
        <div style={styles.links}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...styles.link,
                ...(location.pathname === link.path ? styles.linkActive : {}),
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div style={styles.right}>
        <button onClick={toggle} style={styles.themeBtn} title="Toggle theme">
          {theme === "dark" ? "☀" : "◐"}
        </button>
        <div style={styles.userChip}>
          <span style={styles.username}>{user?.username}</span>
          <span style={styles.roleBadge}>{user?.role}</span>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Déconnexion
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
    padding: "0 32px",
    height: "58px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
  },
  brandName: {
    fontFamily: "var(--font-display)",
    fontWeight: "700",
    fontSize: "18px",
    color: "var(--accent)",
    letterSpacing: "2px",
  },
  links: {
    display: "flex",
    gap: "2px",
  },
  link: {
    color: "var(--text-muted)",
    padding: "6px 12px",
    borderRadius: "var(--radius-sm)",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  linkActive: {
    color: "var(--text)",
    background: "var(--surface2)",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  themeBtn: {
    background: "var(--surface2)",
    color: "var(--text)",
    border: "1px solid var(--border)",
    width: "32px",
    height: "32px",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    borderRadius: "var(--radius-sm)",
  },
  userChip: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "5px 12px",
    background: "var(--surface2)",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border)",
  },
  username: {
    fontSize: "13px",
    fontWeight: "500",
    color: "var(--text)",
  },
  roleBadge: {
    fontSize: "10px",
    fontWeight: "700",
    color: "var(--accent)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  logoutBtn: {
    background: "transparent",
    color: "var(--text-muted)",
    border: "1px solid var(--border)",
    fontSize: "13px",
    padding: "6px 14px",
  },
};
