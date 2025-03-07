import express from "express";
import bodyParser from "body-parser";

import placesRoutes from "./routes/places-routes.js";
import usersRoutes from "./routes/users-routes.js";
import HttpError from "./models/http-error.js";

const app = express();

app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended:true}))

app.use('/api/places',placesRoutes);
app.use('/api/users',usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404)
    throw error
})

app.use((error,req, res, next) => { //error middleware by express
    if(req.headerSent){
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred'})
})

app.listen(5000, () => {
    console.log("Server is running on port 5000")
})