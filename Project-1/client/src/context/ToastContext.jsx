import { createContext, useContext, useState, useCallback, useMemo } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useMemo(
    () => ({
      success: (msg) => addToast(msg, "success"),
      error: (msg) => addToast(msg, "error"),
      warning: (msg) => addToast(msg, "warning"),
      info: (msg) => addToast(msg, "info"),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="stayhub-toast-container" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  let iconClass = "fa-info-circle";
  if (toast.type === "success") iconClass = "fa-check-circle";
  if (toast.type === "error") iconClass = "fa-exclamation-circle";
  if (toast.type === "warning") iconClass = "fa-exclamation-triangle";

  return (
    <div className={`stayhub-toast stayhub-toast--${toast.type}`}>
      <div className="stayhub-toast__icon">
        <i className={`fas ${iconClass}`} aria-hidden="true" />
      </div>
      <div className="stayhub-toast__body">
        <p className="stayhub-toast__text">{toast.message}</p>
      </div>
      <button
        type="button"
        className="stayhub-toast__close-btn"
        onClick={onClose}
        aria-label="Close notification"
      >
        <i className="fas fa-times" aria-hidden="true" />
      </button>
    </div>
  );
}
