 // ✅ 1. IMPORTS (sabse pehle)
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// ✅ 2. APP INIT
const app = express();

// ✅ 3. MIDDLEWARES
app.use(cors());
app.use(express.json());

// ✅ 4. ROUTES IMPORT
const alertRoutes = require("./routes/alerts");

// ✅ 5. ROUTES USE
app.use("/api/alerts", alertRoutes);

// ✅ 6. TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

// ✅ 7. SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
setInterval(() => {
  console.log("Server alive...");
}, 5000);
