// import { v4 as uuid } from "uuid";
import DUMMY_PLACES from "../db/places-dummy-data.js";
import HttpError from "../models/http-error.js";
import { validationResult } from "express-validator";
import { getCoordsForAddress } from "../util/location.js";
import Place from "../models/place.js";
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
    try {
      places = await Place.find({creator: userId})
    } catch (err) {
      const error = new HttpError("Something went wrong", 404)
      return next(error)
    }

    if(!places || places.length === 0){
     return next(new HttpError("Place not found places for this userid", 404))
    }
    res.json({places: places.map(place => place.toObject({getters: true}))});
   
}
export const createPlace = async (req, res, next) => {
    const { title, description,location, address, creator } = req.body;

    
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
      location,
      address,
      creator,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Newtown%2C_Wales.jpg/360px-Newtown%2C_Wales.jpg'
    });
  
    try {
      await createdPlace.save();
    } catch (error) {
      const err = new HttpError(
        "Creating place failed, please try again.",
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



export const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
    if (placeIndex === -1) {
      throw new HttpError("Place not found", 404);
    }
    DUMMY_PLACES.splice(placeIndex, 1);
    res.status(200).json({ message: "Deleted place." });
};

 