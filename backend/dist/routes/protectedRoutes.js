import express from "express";
import passport from "passport";
import { createEvent, getEventById, updateEvent, deleteEvent, } from "@controllers/eventController";
import { createUser, getUsers, getUserById, updateUser, deleteUser, } from "@controllers/userController";
import { checkTrustedOrigin } from "@middleware/checkTrustedOrigin";
const router = express.Router();
// события
router.post("/events", passport.authenticate("jwt", { session: false }), checkTrustedOrigin("POST"), createEvent);
router.get("/events/:id", passport.authenticate("jwt", { session: false }), checkTrustedOrigin("GET"), getEventById);
router.put("/events/:id", passport.authenticate("jwt", { session: false }), checkTrustedOrigin("PUT"), updateEvent);
router.delete("/events/:id", passport.authenticate("jwt", { session: false }), checkTrustedOrigin("DELETE"), deleteEvent);
// пользователи
router.post("/users", passport.authenticate("jwt", { session: false }), checkTrustedOrigin("POST"), createUser);
router.get("/users", passport.authenticate("jwt", { session: false }), checkTrustedOrigin("GETS"), getUsers);
router.get("/users/:id", passport.authenticate("jwt", { session: false }), checkTrustedOrigin("GET"), getUserById);
router.put("/users/:id", passport.authenticate("jwt", { session: false }), checkTrustedOrigin("PUT"), updateUser);
router.delete("/users/:id", passport.authenticate("jwt", { session: false }), checkTrustedOrigin("DELETE"), deleteUser);
export default router;
