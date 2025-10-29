import { Router } from "express";
import { getDevices, addDevice } from "../controllers/deviceController.js";

const router = Router();

router.get("/", getDevices);
router.post("/", addDevice);

export default router;
