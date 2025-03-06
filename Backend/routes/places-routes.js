import express from "express";

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log("Get Request in Places")
    res.json({
        message: "This is from places"
    })
})

export default router