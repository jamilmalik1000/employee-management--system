import { AlertTriangle, LoaderCircle, LockKeyhole } from "lucide-react";

export function AppLoader({ label = "Loading your workspace…", fullPage = false }: { label?: string; fullPage?: boolean }) {
  return (
    <div className={fullPage ? "app-state app-state-full" : "app-state"} role="status" aria-live="polite">
      <LoaderCircle className="animate-spin" size={24} />
      <p>{label}</p>
    </div>
  );
}

export function AccessDenied({ message = "You do not have permission to view this page." }: { message?: string }) {
  return (
    <div className="app-state card" role="alert">
      <span className="app-state-icon"><LockKeyhole size={24} /></span>
      <h1>Access denied</h1>
      <p>{message}</p>
    </div>
  );
}

export function LoadError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="app-state" role="alert">
      <span className="app-state-icon danger"><AlertTriangle size={22} /></span>
      <h2>Unable to load data</h2>
      <p>{message}</p>
      {onRetry && <button type="button" className="btn btn-secondary" onClick={onRetry}>Try again</button>}
    </div>
  );
}
