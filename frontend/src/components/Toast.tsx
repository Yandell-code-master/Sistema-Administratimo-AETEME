import { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  icon?: string;
  onDismiss?: () => void;
  duration?: number;
}

/* Aviso emergente reutilizable (clase .toast-aeteme / .is-visible). */
export default function Toast({
  message,
  icon = 'check_circle',
  onDismiss,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => {
      onDismiss?.();
    }, duration);
    return () => window.clearTimeout(timer);
  }, [message, duration, onDismiss]);

  if (!message) return null;

  return (
    <div className="toast-aeteme text-label-md is-visible" role="status" aria-live="polite">
      <span className="material-symbols-outlined" aria-hidden="true">
        {icon}
      </span>
      <span>{message}</span>
    </div>
  );
}
