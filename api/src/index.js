import "dotenv/config";
import express from "express";
import deviceRoutes from "./routes/devicesRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();
app.use(express.json());

app.use("/api/devices", deviceRoutes);
app.use("/api/messages", messageRoutes);

app.use("/webhook", webhookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
