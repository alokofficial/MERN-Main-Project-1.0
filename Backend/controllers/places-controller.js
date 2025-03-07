import { v4 as uuid } from "uuid";
import DUMMY_PLACES from "../db/dummy-data.js";
import HttpError from "../models/http-error.js";
export const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid; //{pid: 'p1'}
    const place = DUMMY_PLACES.find((p) => p.id === placeId);
    if(!place){
      throw new HttpError("Place not found", 404)
    }
    res.json({ place });
  };

export const getPlaceByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter(p => p.creator === userId);
    if(!places){
     return next(new HttpError("Place not found for this user", 404))
    }
    res.json({places});
   
}
export const createPlace = (req, res, next) => {
    const { title, description,coordinates, address, creator } = req.body;
  
    const createdPlace = {
      id: uuid(),
      title,
      description,
      location: coordinates,
      address,
      creator,
    };
  
    DUMMY_PLACES.push(createdPlace); // for pushing in last we use unshift method.
  
    res.status(201).json({ place: createdPlace });
  };
export const updatePlace = (req, res, next) => {
    const placeId = req.params.pid;
    const { title, description } = req.body;

    const updatePlace = {...DUMMY_PLACES.find((p) => p.id === placeId)};
    const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);

    updatePlace.title = title;
    updatePlace.description = description;

    DUMMY_PLACES[placeIndex] = updatePlace;

    res.status(200).json({ place: updatePlace });
};



export const deletePlace = (req, res, next) => {};

 