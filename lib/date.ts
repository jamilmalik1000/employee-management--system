/** Local (not UTC) calendar date as "YYYY-MM-DD", matching what <input type="date"> produces. */
export function todayLocalISO(d: Date = new Date()): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Local wall-clock time as "HH:mm", matching what <input type="time"> produces. */
export function nowLocalTime(d: Date = new Date()): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mi}`;
}
