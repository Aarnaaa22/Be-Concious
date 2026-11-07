/**
 * Privacy-Preserving Diagnostic Scanner Logger
 * Maintains a circular memory buffer of recent scan attempts, timings, and resolution states.
 * DOES NOT capture user emails, personal credentials, or sensitive PII.
 */

const MAX_LOG_ENTRIES = 50;
const logBuffer = [];

export const scanLogger = {
  log(event) {
    const entry = {
      timestamp: new Date().toISOString(),
      format: event.format || 'UNKNOWN',
      barcodeLength: event.barcode ? event.barcode.length : 0,
      barcodePrefix: event.barcode ? event.barcode.substring(0, 3) : null,
      source: event.source || 'SCANNER',
      action: event.action,
      durationMs: event.durationMs || 0,
      status: event.status || 'INFO',
      message: event.message || '',
    };

    logBuffer.unshift(entry);
    if (logBuffer.length > MAX_LOG_ENTRIES) {
      logBuffer.pop();
    }

    if (process.env.NODE_ENV !== 'production' || window.__BE_CONSCIOUS_DEBUG) {
      console.log(`[ScanLog][${entry.status}] ${entry.action} -> ${entry.message} (${entry.durationMs}ms)`);
    }
  },

  getRecentLogs() {
    return [...logBuffer];
  },

  clear() {
    logBuffer.length = 0;
  }
};

