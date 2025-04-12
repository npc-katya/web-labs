import express, { RequestHandler } from "express";
import passport from "passport";

import {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
} from "@controllers/eventController";

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "@controllers/userController";

import { checkTrustedOrigin } from "@middleware/checkTrustedOrigin";

const router = express.Router();

// события
router.post(
  "/events",
  passport.authenticate("jwt", { session: false }),
  checkTrustedOrigin("POST"),
  createEvent as RequestHandler,
);
router.get(
  "/events/:id",
  passport.authenticate("jwt", { session: false }),
  checkTrustedOrigin("GET"),
  getEventById as RequestHandler,
);
router.put(
  "/events/:id",
  passport.authenticate("jwt", { session: false }),
  checkTrustedOrigin("PUT"),
  updateEvent as RequestHandler,
);
router.delete(
  "/events/:id",
  passport.authenticate("jwt", { session: false }),
  checkTrustedOrigin("DELETE"),
  deleteEvent as RequestHandler,
);

// пользователи
router.post(
  "/users",
  passport.authenticate("jwt", { session: false }),
  checkTrustedOrigin("POST"),
  createUser as RequestHandler,
);
router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  checkTrustedOrigin("GETS"),
  getUsers,
);
router.get(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  checkTrustedOrigin("GET"),
  getUserById as RequestHandler,
);
router.put(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  checkTrustedOrigin("PUT"),
  updateUser as RequestHandler,
);
router.delete(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  checkTrustedOrigin("DELETE"),
  deleteUser as RequestHandler,
);

export default router;
