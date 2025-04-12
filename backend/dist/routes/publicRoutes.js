import express from "express";
import { getEvents } from "@controllers/eventController";
import { checkTrustedOrigin } from "@middleware/checkTrustedOrigin";
const router = express.Router();
router.get("/events", checkTrustedOrigin("GETS"), getEvents);
export default router;
