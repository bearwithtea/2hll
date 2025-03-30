const express = require("express");
const app = express();
const port = 3000;

// Middleware
app.use(express.static("."));
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// Handle POST requests to /api/subscribe
app.post("/api/subscribe", async (req, res) => {
  console.log("Received subscription request:", req.body);
  try {
    const handler = require("./api/subscribe.js").default;
    await handler(req, res);
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Open http://localhost:${port} in your browser to test the form`);
});
