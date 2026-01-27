function getNow(req) {
  try {
    if (process.env.TEST_MODE === "1") {
      const now = req.headers["x-test-now-ms"];

      if (now) {
        const timestamp = Number(now);

        if (!Number.isNaN(timestamp)) {
          return new Date(timestamp);
        }
      }
    }
  } catch (error) {
    console.error("getNow error:", error);
  }

  return new Date();
}

module.exports = getNow;
