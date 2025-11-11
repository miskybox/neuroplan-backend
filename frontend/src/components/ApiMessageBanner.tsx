import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useEffect, useState } from "react";

type BannerType = "success" | "error" | "info" | "warning";

export type ApiMessageBannerProps = {
  type: BannerType;
  message: string;
  title?: string;
  onClose?: () => void;
  autoDismissMs?: number;
};

const iconByType: Record<BannerType, JSX.Element> = {
  success: <CheckCircle2 className="h-4 w-4" aria-hidden />,
  error: <AlertCircle className="h-4 w-4" aria-hidden />,
  info: <Info className="h-4 w-4" aria-hidden />,
  warning: <AlertCircle className="h-4 w-4" aria-hidden />,
};

export function ApiMessageBanner({
  type,
  message,
  title,
  onClose,
  autoDismissMs,
}: Readonly<ApiMessageBannerProps>) {
  useEffect(() => {
    if (!autoDismissMs) return;
    const id = globalThis.setTimeout(() => onClose?.(), autoDismissMs);
    return () => globalThis.clearTimeout(id);
  }, [autoDismissMs, onClose]);

  const polite = type === "success" || type === "info";

  return (
    <section
      aria-label="Notification message"
      aria-live={polite ? "polite" : "assertive"}
      className="mb-4"
    >
      <Alert variant={type === "error" ? "destructive" : "default"}>
        {iconByType[type]}
        <AlertDescription>
          {title ? <strong className="mr-1">{title}</strong> : null}
          {message}
        </AlertDescription>
      </Alert>
    </section>
  );
}

export default ApiMessageBanner;

// Centro de mensajes basado en eventos globales
// Escucha eventos "api-message" { detail: { type: 'success'|'error'|'info'|'warning', message: string } }
export function ApiMessageCenter() {
  const [msg, setMsg] = useState<{ type: BannerType; message: string } | null>(
    null
  );

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ type: BannerType; message: string }>;
      if (ce.detail?.message && ce.detail?.type) {
        setMsg({ type: ce.detail.type, message: ce.detail.message });
      }
    };
    globalThis.addEventListener("api-message", handler);
    return () => globalThis.removeEventListener("api-message", handler);
  }, []);

  if (!msg) return null;
  return (
    <ApiMessageBanner
      type={msg.type}
      message={msg.message}
      onClose={() => setMsg(null)}
      autoDismissMs={3000}
    />
  );
}
