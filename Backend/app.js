import express from "express";
import bodyParser from "body-parser";

import placesRoutes from "./routes/places-routes.js";

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(placesRoutes);

app.use((req, res, next) => {
    res.status(404).json({message:"Not Found"})
})

app.listen(5000, () => {
    console.log("Server is running on port 5000")
})