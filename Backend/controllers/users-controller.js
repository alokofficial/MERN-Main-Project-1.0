import User from "../models/user.js";
import HttpError from "../models/http-error.js";
import { validationResult } from "express-validator";
export const getUsers = async(req, res, next) => {
    let users;
    try {
        users = await User.find({},'-password') // to hide the password
    } catch (error) {
        const err = new HttpError(
            "Fetching users failed, please try again.",
            500
        )
        return next(err)
    }
    res.json({users: users.map(user => user.toObject({getters: true}))})
};
export const userSignup = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError("Invalid inputs passed, please check your data", 422));
    }
    
    const {name, email, password,places} = req.body

    let existingUser;
    try {
        existingUser =  await User.findOne({email:email})
    } catch (error) {
        const err = new HttpError(
            "Signing up failed, please try again.",
            500
        )
    }
    if(existingUser){
        const error = new HttpError("User exists already with this email, please login instead", 422);
        return next(error)
    }
    const createdUser= new User({
        name,
        email,
        password,
        image:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Newtown%2C_Wales.jpg/360px-Newtown%2C_Wales.jpg',
        places,
    })
    try {
        await createdUser.save()
    } catch (error) {
        const err = new HttpError(
            "Signing up failed-2, please try again.",
            500
        )
        return next(err)
    }

    res.status(201).json({user:createdUser.toObject({getters:true})})

};
export const userLogin = async(req, res, next) => {
    const {email, password} = req.body
    let identifiedUser;
    try {
        identifiedUser = await User.findOne({email:email})
    } catch (error) {
        const err = new HttpError(
            "Logging in failed, please try again.",
            500
        )
        return next(err)
    }

    if(!identifiedUser || identifiedUser.password !== password){
       const error = new HttpError('Could not identify user, creadential seem to be wrong', 401)
       return next(error)
    }
    res.status(200).json({message:'Logged in successfully',user:identifiedUser.toObject({getters:true})})
};
