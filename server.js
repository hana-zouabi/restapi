const express = require("express");
const connectDB = require("./config/connectDB");
require("dotenv").config();
const app = express();

const PORT = 5000;
connectDB();
app.use(express.json());
// link router
app.use("/api", require("./Routes/routeUser"));
app.use("/auth", require("./Routes/Auth"));
app.use("/login", require("./Routes/Auth"));
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server running on PORT 5000 Http://localhost:${PORT}`);
});
