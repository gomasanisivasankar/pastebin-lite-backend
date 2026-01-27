module.exports = function getNow(req) {
  if (process.env.TEST_MODE === "1") {
    const now = req.headers["x-test-now-ms"];
    if (now) {
      return new Date(Number(now));
    }
  }
  return new Date();
};
