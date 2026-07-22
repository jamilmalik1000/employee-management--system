"use client";

import { useEffect, useMemo, useState } from "react";

export function usePagination<T>(items: T[], initialPageSize = 5) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, pageCount);

  useEffect(() => { setPage(1); }, [items, pageSize]);
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);

  const pageItems = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize],
  );

  return { page: safePage, setPage, pageSize, setPageSize, pageCount, pageItems };
}
