import express from "express";
import DUMMY_PLACES from "../db/dummy-data.js";

const router = express.Router();


router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid; //{pid: 'p1'}
  const place = DUMMY_PLACES.find((p) => p.id === placeId);
  console.log("Get Request in Places");
  res.json({ place });
});


export default router;
