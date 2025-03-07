import express from "express";
import { getUsers, userLogin, userSignup } from "../controllers/users-controller.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/signup", userSignup);
router.post("/login", userLogin);

export default router;
