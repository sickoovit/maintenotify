import "dotenv/config";
import express from "express";
import deviceRoutes from "./routes/devices.js";
import whatsappRoutes from "./routes/whatsapp.js";

const app = express();
app.use(express.json());

app.use("/api/devices", deviceRoutes);
app.use("/api/whatsapp", whatsappRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
