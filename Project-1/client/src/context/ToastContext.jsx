import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    // #region agent log
    fetch('http://127.0.0.1:7918/ingest/201cc7d6-0c1b-4579-938a-53ee7c86be9d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'bdcf01'},body:JSON.stringify({sessionId:'bdcf01',runId:'post-fix',location:'ToastContext.jsx:addToast',message:'addToast called',data:{id,message,type},timestamp:Date.now(),hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    setToasts((prev) => [...prev, { id, message, type }]);

    // Automatically dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, "success"),
    error: (msg) => addToast(msg, "error"),
    warning: (msg) => addToast(msg, "warning"),
    info: (msg) => addToast(msg, "info"),
  };

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
    // #region agent log
    fetch('http://127.0.0.1:7918/ingest/201cc7d6-0c1b-4579-938a-53ee7c86be9d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'bdcf01'},body:JSON.stringify({sessionId:'bdcf01',location:'ToastContext.jsx:useToast',message:'useToast missing provider',data:{hasContext:false},timestamp:Date.now(),hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastContainer({ toasts, removeToast }) {
  // #region agent log
  fetch('http://127.0.0.1:7918/ingest/201cc7d6-0c1b-4579-938a-53ee7c86be9d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'bdcf01'},body:JSON.stringify({sessionId:'bdcf01',location:'ToastContext.jsx:ToastContainer',message:'ToastContainer render',data:{count:toasts.length,toasts:toasts.map(t=>({id:t.id,type:t.type,msgLen:t.message?.length}))},timestamp:Date.now(),hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  return (
    <div className="stayhub-toast-container" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  // #region agent log
  if (typeof document !== 'undefined') { const el = document.querySelector('.stayhub-toast-container'); const cs = el ? getComputedStyle(el) : null; fetch('http://127.0.0.1:7918/ingest/201cc7d6-0c1b-4579-938a-53ee7c86be9d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'bdcf01'},body:JSON.stringify({sessionId:'bdcf01',location:'ToastContext.jsx:ToastItem',message:'ToastItem render + CSS check',data:{toastType:toast.type,containerFound:!!el,position:cs?.position,zIndex:cs?.zIndex,display:cs?.display},timestamp:Date.now(),hypothesisId:'A-B'})}).catch(()=>{}); }
  // #endregion
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
