import express from "express";
import dotenv from "dotenv";
import deviceRoutes from "./routes/devices.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/devices", deviceRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
