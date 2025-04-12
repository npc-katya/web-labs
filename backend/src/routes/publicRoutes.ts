import express from "express";
import { getEvents } from "../controllers/eventController.js";
import { checkTrustedOrigin } from "../middleware/checkTrustedOrigin.js";

const router = express.Router();

router.get("/events", checkTrustedOrigin("GETS"), getEvents);

export default router;
