import { Router } from "express";
import {
  getDevices,
  addDevice,
  updateStatus,
} from "../controllers/deviceController.js";

const router = Router();

router.get("/", getDevices);
router.post("/", addDevice);
router.patch("/:id/status", updateStatus);

export default router;
