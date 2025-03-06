import express from "express";
import DUMMY_PLACES from "../db/dummy-data.js";
import e from "express";

const router = express.Router();


router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid; //{pid: 'p1'}
  const place = DUMMY_PLACES.find((p) => p.id === placeId);
  if(!place){
    const error = new Error("Place not found place for the provided id");
    error.code = 404;
    throw error
  }
  console.log("Get Request in Places");
  res.json({ place });
});

router.get('/user/:uid', (req, res, next) => {
      const userId = req.params.uid;
      const places = DUMMY_PLACES.filter(p => p.creator === userId);
      if(!places){
        const error = new Error("Place not found place for the provided user id");
        error.code = 404;
        return next(error)
      }
      res.json({places});
     
})

export default router;
