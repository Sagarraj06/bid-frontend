// Lightweight client-side storage for report history
// Stores per-user reports in localStorage under the key "reports:v1"

export type StoredReport = {
  id: string;
  userEmail: string;
  sellerName: string;
  department: string;
  offeredItem: string;
  createdAt: string; // ISO
  fileName?: string;
};

const STORAGE_KEY = "reports:v1";

function readAll(): StoredReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(items: StoredReport[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota errors silently
  }
}

export function saveReport(report: StoredReport) {
  const all = readAll();
  all.unshift(report); // newest first
  writeAll(all);
}

export function getReportsByUser(userEmail: string): StoredReport[] {
  return readAll().filter(r => r.userEmail === userEmail);
}

export function getReportCount(userEmail: string): number {
  return getReportsByUser(userEmail).length;
}
