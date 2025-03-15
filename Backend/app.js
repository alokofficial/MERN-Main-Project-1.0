import fs from "fs";
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import placesRoutes from "./routes/places-routes.js";
import usersRoutes from "./routes/users-routes.js";
import HttpError from "./models/http-error.js";

const app = express();

app.use(bodyParser.json())
app.use('/uploads/images', express.static(path.join('uploads', 'images')))
// app.use(bodyParser.urlencoded({extended:true}))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next(); 
})
app.use('/api/places',placesRoutes);
app.use('/api/users',usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404)
    throw error
})

app.use((error,req, res, next) => { //error middleware by express
    if(req.file){
        fs.unlink(req.file.path, err => {
            console.log(err)
        })
    }
    if(req.headerSent){
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred'})
})
mongoose.connect(`mongodb://localhost:27017/mern_project`).then(
    () => {
        app.listen(5000, () => {
            console.log("Server is running on port 5000")
        }) 
    }
).catch(
    err => {
        console.log(err)
    }
);