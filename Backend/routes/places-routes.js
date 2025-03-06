import express from "express";
import DUMMY_PLACES from "../db/dummy-data.js";
import HttpError from "../models/http-error.js";

const router = express.Router();


router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid; //{pid: 'p1'}
  const place = DUMMY_PLACES.find((p) => p.id === placeId);
  if(!place){
    throw new HttpError("Place not found", 404)
  }
  console.log("Get Request in Places");
  res.json({ place });
});

router.get('/user/:uid', (req, res, next) => {
      const userId = req.params.uid;
      const places = DUMMY_PLACES.filter(p => p.creator === userId);
      if(!places){
       return next(new HttpError("Place not found for this user", 404))
      }
      res.json({places});
     
})

export default router;
