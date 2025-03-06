import express from "express";
import { createPlace, getPlaceById, getPlaceByUserId } from "../controllers/places-controller.js";



const router = express.Router();
router.get("/:pid",getPlaceById);

router.get('/user/:uid',getPlaceByUserId)
router.post('/',createPlace);

export default router;
