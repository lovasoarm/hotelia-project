import { useEffect, useState } from "react";

let listeners = [];
let toastId = 0;

export const toast = {
  success: (msg) => emit({ type: "success", msg }),
  error: (msg) => emit({ type: "error", msg }),
  warning: (msg) => emit({ type: "warning", msg }),
};

function emit(t) {
  const id = ++toastId;
  listeners.forEach((fn) => fn({ ...t, id }));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (t) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 3500);
    };
    listeners.push(handler);
    return () => {
      listeners = listeners.filter((fn) => fn !== handler);
    };
  }, []);

  const colors = {
    success: {
      bg: "rgba(82,201,122,0.12)",
      border: "rgba(82,201,122,0.3)",
      color: "#52c97a",
    },
    error: {
      bg: "rgba(224,82,82,0.12)",
      border: "rgba(224,82,82,0.3)",
      color: "#e05252",
    },
    warning: {
      bg: "rgba(224,169,82,0.12)",
      border: "rgba(224,169,82,0.3)",
      color: "#e0a952",
    },
  };

  return (
    <div style={styles.container}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            ...styles.toast,
            background: colors[t.type].bg,
            borderColor: colors[t.type].border,
            color: colors[t.type].color,
          }}
        >
          <span style={styles.dot(colors[t.type].color)} />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    pointerEvents: "none",
  },
  toast: {
    padding: "12px 18px",
    borderRadius: "8px",
    border: "1px solid",
    fontSize: "13px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backdropFilter: "blur(12px)",
    animation: "slideIn 0.3s ease",
    minWidth: "260px",
    maxWidth: "380px",
  },
  dot: (color) => ({
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: color,
    flexShrink: 0,
  }),
};
