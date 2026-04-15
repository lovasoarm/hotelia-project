import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      o: Math.random() * 0.4 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,169,110,${p.o})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;
      });

      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach((q) => {
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(200,169,110,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };

    draw();

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

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
    } catch {
      setError("Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <canvas ref={canvasRef} style={styles.canvas} />

      <div style={styles.left}>
        <div style={styles.heroContent}>
          <p style={styles.heroEyebrow}>Système de gestion</p>
          <h1 style={styles.heroTitle}>HOTELIA</h1>
          <p style={styles.heroSub}>
            Gérez vos clients, chambres, réservations et factures depuis une
            interface unifiée.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=60"
          alt="Hotel lobby"
          style={styles.heroImg}
        />
        <div style={styles.heroOverlay} />
      </div>

      <div style={styles.right}>
        <div style={styles.formBox}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Connexion</h2>
            <p style={styles.formSub}>Accédez à votre espace de gestion</p>
          </div>

          {error && <div style={styles.errorMsg}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Nom d'utilisateur</label>
              <input
                type="text"
                placeholder="admin"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                style={styles.input}
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
                style={styles.input}
                required
              />
            </div>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#0e0e0e",
    position: "relative",
    overflow: "hidden",
  },
  canvas: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
  },
  left: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "48px",
  },
  heroImg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 0.35,
    zIndex: 0,
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, #0e0e0e 0%, transparent 60%)",
    zIndex: 1,
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    marginBottom: "32px",
  },
  heroEyebrow: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "2px",
    color: "#c8a96e",
    marginBottom: "12px",
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "64px",
    fontWeight: "700",
    color: "#f0f0f0",
    lineHeight: 1,
    marginBottom: "16px",
  },
  heroSub: {
    fontSize: "15px",
    color: "rgba(240,240,240,0.6)",
    maxWidth: "380px",
    lineHeight: 1.7,
  },
  right: {
    width: "440px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 40px",
    background: "rgba(22,22,22,0.95)",
    backdropFilter: "blur(20px)",
    borderLeft: "1px solid rgba(255,255,255,0.06)",
    position: "relative",
    zIndex: 2,
  },
  formBox: {
    width: "100%",
  },
  formHeader: {
    marginBottom: "32px",
  },
  formTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#f0f0f0",
    marginBottom: "6px",
  },
  formSub: {
    fontSize: "13px",
    color: "#888",
  },
  errorMsg: {
    background: "rgba(224,82,82,0.1)",
    border: "1px solid rgba(224,82,82,0.25)",
    color: "#e05252",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    background: "#1e1e1e",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    padding: "12px 14px",
    color: "#f0f0f0",
    fontSize: "14px",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  },
  submitBtn: {
    background: "#c8a96e",
    color: "#0e0e0e",
    border: "none",
    borderRadius: "8px",
    padding: "13px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "8px",
    letterSpacing: "0.5px",
    transition: "background 0.2s",
  },
};
