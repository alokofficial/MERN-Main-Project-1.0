import fs from "fs";
import HttpError from "../models/http-error.js";
import { validationResult } from "express-validator";
// import { getCoordsForAddress } from "../util/location.js";
import mongoose from "mongoose";
import Place from "../models/place.js";
import User from "../models/user.js";
export const getPlaceById = async(req, res, next) => {
    const placeId = req.params.pid; //{pid: 'p1'}
    let place
    try {
      place = await Place.findById(placeId)
    } catch (err) {
      const error = new HttpError("Something went wrong", 404)
      return next(error)
    }
    if(!place){
      const error = new HttpError("Place not found", 404)
      return next(error)
    }
    res.json({ place: place.toObject({ getters: true }) }); // to get the id in normal form 
  };

export const getPlacesByUserId = async(req, res, next) => {
    const userId = req.params.uid;

    let places
    let userWithPlaces
    try {
      // places = await Place.find({creator: userId})
      userWithPlaces = await User.findById(userId).populate('places')
    } catch (err) {
      const error = new HttpError("Something went wrong", 404)
      return next(error)
    }

    // if(!places || places.length === 0){
    if(!userWithPlaces|| userWithPlaces.places.length === 0){
     return next(new HttpError("Place not found places for this userid", 404))
    }
    res.json({places: userWithPlaces.places.map(place => place.toObject({getters: true}))});
   
}
export const createPlace = async (req, res, next) => {
    const { title, description, address, creator } = req.body;

    
    // try {
      
    //   let coordinates = getCoordsForAddress(address);
      
    // } catch (error) {
    //   return next(error)
    // }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError("Invalid inputs passed, please check your data", 422));
    }
  
    const createdPlace =   new Place({
      title,
      description,
      // location,
      address,
      creator,
      image: req.file.path,
    });

    let user
    try {
      user = await User.findById(creator)
    } catch (error) {
      const err = new HttpError(
        "Creating place failed-1, please try again.",
        500
      )
      return next(err)
    }
    if(!user){
      const error = new HttpError("User not found for the provided id", 404);
      return next(error);
    }

    console.log(user)

    try{
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await createdPlace.save({session:sess})
      user.places.push(createPlace)
      await user.save({session:sess})
      await sess.commitTransaction();
    }
    catch (error) {
      const err = new HttpError(
        "Creating place failed-2, please try again.",
        500
      )
      return next(err)
    }
  
    res.status(201).json({ place: createdPlace });
  };
export const updatePlace = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }
    const placeId = req.params.pid;
    const { title, description } = req.body;

    let updatePlace
    try {
      updatePlace = await Place.findById(placeId);
    } catch (error) {
      const err = new HttpError(
        "Updating place failed, please try again.",
        500
      )
      return next(err)
    }
    if(updatePlace.creator.toString() !== req.userData.userId){
      const error = new HttpError("You are not allowed to edit this place", 401);
      return next(error);
    }
    if (!updatePlace) {
      const error = new HttpError("Place not found", 404);
      return next(error);
    } 

    updatePlace.title = title;
    updatePlace.description = description;

    try {
      await updatePlace.save();
    } catch (error) {
      const err = new HttpError(
        "Updating place failed, please try again.",
        500
      )
      return next(err)
    }

    res.status(200).json({ place: updatePlace.toObject({ getters: true }) });
};



export const deletePlace = async(req, res, next) => {
    const placeId = req.params.pid;

    let place
    try {
      place = await Place.findById(placeId).populate('creator'); 
    } catch (error) {
      const err = new HttpError(
        "Deleting place failed-1, please try again.",
        500
      )
      return next(err)
    }
    if (!place) {
     const error = new HttpError("Place not found for this id", 404);
     return next(error);
   }

   const imagePath = place.image;
   try {
     const sess = await mongoose.startSession();
     sess.startTransaction();
     place.remove({session:sess})
     place.creator.places.pull(place);
     await place.creator.save({session:sess})
     await sess.commitTransaction();
   } catch (error) {
     const err = new HttpError(
       "Deleting place failed-2, please try again.",
       500
     )
     return next(err)
   }

   fs.unlink(imagePath, err => {
     console.log(err)
   })
    res.status(200).json({ message: "Place Deleted" });
};

 