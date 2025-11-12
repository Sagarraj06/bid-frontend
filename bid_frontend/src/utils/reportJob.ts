// =================== utils/reportJob.ts ===================

// Use localStorage to persist jobId (you can switch to sessionStorage)
const storage = window.localStorage;

// ✅ Use relative path so Vite proxy works in development
const API_BASE =
  import.meta.env.MODE === "development"
    ? "/api/api/pdf/"
    : "http://161.118.181.8/api/api/pdf/";

/**
 * 1️⃣ Start a new report generation job
 * POST /api/api/pdf/
 */
export async function enqueueJob(payload: any) {
  try {
    const resp = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      throw new Error(`Failed to enqueue job: ${resp.status} ${await resp.text()}`);
    }

    const data = await resp.json();
    const jobId = data.jobId;
    console.log("✅ Job enqueued:", jobId);

    storage.setItem("pdfJobId", jobId);
    return jobId;
  } catch (err) {
    console.error("❌ enqueueJob error:", err);
    throw err;
  }
}

/**
 * 2️⃣ Poll job status once
 * GET /api/api/pdf/:jobId
 */
export async function pollJobOnce(jobId: string) {
  if (!jobId) {
    console.warn("⚠️ pollJobOnce: No jobId provided");
    return null;
  }

  try {
    const resp = await fetch(`${API_BASE}${encodeURIComponent(jobId)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!resp.ok) {
      throw new Error(`Polling failed: ${resp.status} ${await resp.text()}`);
    }

    const data = await resp.json();
    console.log(`📡 Job ${jobId} status:`, data.status);

    if (["completed", "failed", "canceled"].includes(data.status)) {
      storage.removeItem("pdfJobId");
      console.log(`✅ Job ${jobId} finished (${data.status}), removed from storage.`);
    }

    return data;
  } catch (err) {
    console.error("❌ pollJobOnce error:", err);
    return null;
  }
}

/**
 * 3️⃣ Poll controller — checks job every 10s for up to 400s (40 tries)
 */
export function startPollingJob(
  jobId: string,
  onUpdate?: (data: any) => void,
  onDone?: (data: any) => void
) {
  const intervalMs = 10_000;
  const maxDurationMs = 400_000;
  const maxAttempts = Math.floor(maxDurationMs / intervalMs);
  let attempts = 0;

  console.log(`🕒 Polling for job ${jobId} every ${intervalMs / 1000}s (max ${maxDurationMs / 1000}s)`);

  const interval = setInterval(async () => {
    attempts++;
    const data = await pollJobOnce(jobId);
    if (!data) return;

    if (onUpdate) onUpdate(data);

    if (["completed", "failed", "canceled"].includes(data.status)) {
      clearInterval(interval);
      console.log("⏹️ Polling stopped — job finished.");
      if (onDone) onDone(data);
      return;
    }

    if (attempts >= maxAttempts) {
      clearInterval(interval);
      console.warn("⏹️ Polling stopped after timeout (400s).");
    }
  }, intervalMs);
}

/**
 * 4️⃣ Resume pending job after reload
 */
export function resumePendingJob(onDone?: (data: any) => void) {
  const jobId = storage.getItem("pdfJobId");
  if (jobId) {
    console.log("♻️ Resuming polling for saved job:", jobId);
    startPollingJob(jobId, undefined, onDone);
  }
}
