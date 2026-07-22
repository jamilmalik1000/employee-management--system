"use client";

import { useCallback, useEffect, useState } from "react";

interface RemoteListOptions {
  open: boolean;
  url: string;
  errorMessage: string;
  enabled?: boolean;
}

export function useRemoteList<T>({
  open,
  url,
  errorMessage,
  enabled = true,
}: RemoteListOptions) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requestVersion, setRequestVersion] = useState(0);

  const retry = useCallback(() => {
    setRequestVersion((version) => version + 1);
  }, []);

  useEffect(() => {
    if (!open || !enabled) {
      setItems([]);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadList() {
      setLoading(true);
      setError("");
      setItems([]);

      try {
        const response = await fetch(url, { signal: controller.signal });
        const data: unknown = await response.json().catch(() => null);

        if (!response.ok) {
          const apiMessage =
            data && typeof data === "object" && "message" in data && typeof data.message === "string"
              ? data.message
              : errorMessage;
          throw new Error(apiMessage);
        }

        if (!Array.isArray(data)) {
          throw new Error(errorMessage);
        }

        setItems(data as T[]);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(requestError instanceof Error ? requestError.message : errorMessage);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadList();

    return () => controller.abort();
  }, [enabled, errorMessage, open, requestVersion, url]);

  return { items, loading, error, retry };
}
