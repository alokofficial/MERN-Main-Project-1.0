import express from "express";
import { check } from "express-validator";
import {
  getUsers,
  userLogin,
  userSignup,
} from "../controllers/users-controller.js";

const router = express.Router();

router.get("/", getUsers);
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 5 }),
  ],
  userSignup
);
router.post("/login", userLogin);

export default router;
