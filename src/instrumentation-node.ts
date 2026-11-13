function isShutdownMessage(message: unknown): boolean {
  return typeof message === "object" && message !== null && "type" in message && message.type === "CROWNIX_SHUTDOWN";
}

function requestGracefulShutdown() {
  // Trigger Next.js's normal production SIGTERM handler.
  process.emit("SIGTERM");
}

process.on("message", (message) => {
  if (isShutdownMessage(message)) {
    requestGracefulShutdown();
  }
});

// If Electron crashes or exits unexpectedly, the IPC channel
// disconnects. Do not leave an orphaned Next.js server running.
process.on("disconnect", requestGracefulShutdown);

export {};
