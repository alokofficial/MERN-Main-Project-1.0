import { v4 as uuid } from "uuid";
import DUMMY_USERS from "../db/users-dummy-data.js";
import HttpError from "../models/http-error.js";
export const getUsers = (req, res, next) => {
   res.json({users:DUMMY_USERS})
};
export const userSignup = (req, res, next) => {
    const {name, email, password} = req.body

    const hasUser = DUMMY_USERS.find(u=>u.email===email)
    if(hasUser){
        throw new HttpError('User already exists', 422)
    }

    const createdUser={
        id:uuid(),
        name,
        email,
        password
    }

    DUMMY_USERS.push(createdUser)

    res.status(201).json({user:createdUser})

};
export const userLogin = (req, res, next) => {
    const {email, password} = req.body
    const identifiedUser = DUMMY_USERS.find(u=>u.email===email)

    if(!identifiedUser || identifiedUser.password !== password){
        throw new HttpError('Could not identify user, creadential seem to be wrong', 401)
    }
    res.status(200).json({user:identifiedUser})
};
