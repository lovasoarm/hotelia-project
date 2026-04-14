import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(
        { username: res.data.username, role: res.data.role },
        res.data.token,
      );
      navigate("/dashboard");
    } catch (err) {
      setError("Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>H</div>
          <h1 style={styles.title}>HOTELIA</h1>
          <p style={styles.subtitle}>Système de gestion hôtelière</p>
        </div>

        {error && <div className="msg-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Nom d'utilisateur</label>
            <input
              type="text"
              placeholder="admin"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "40px",
    width: "100%",
    maxWidth: "380px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  logo: {
    background: "#e94560",
    color: "#fff",
    width: "52px",
    height: "52px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "22px",
    margin: "0 auto 16px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#1a1a2e",
    letterSpacing: "3px",
    marginBottom: "6px",
  },
  subtitle: {
    color: "#888",
    fontSize: "13px",
  },
  field: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#444",
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    fontSize: "15px",
    fontWeight: "600",
    marginTop: "8px",
    borderRadius: "8px",
  },
};
