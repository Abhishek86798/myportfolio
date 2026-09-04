/** Format date as ISO "YYYY-MM-DD" (§3). Engineers write dates that sort. */
export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toISOString().split("T")[0];
}
