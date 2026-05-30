/** Background `after()` gets this long before client recovery may rerun the pipeline. */
export const ANALYSIS_RECOVERY_MS = 45 * 1000;

export const PROCESSING_STALE_MS = 15 * 60 * 1000;

/** Stale analysis lock can be reclaimed after this many seconds (matches processing stale window). */
export const ANALYSIS_LOCK_STALE_SECONDS = PROCESSING_STALE_MS / 1000;

export const STATUS_UPDATE_MAX_ATTEMPTS = 3;
