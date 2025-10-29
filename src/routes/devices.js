import { Router } from "express";
import { addDevice, updateDevice } from "../controllers/deviceController.js";

const router = Router();
router.post("/", addDevice);
router.put("/:id", updateDevice);
export default router;
