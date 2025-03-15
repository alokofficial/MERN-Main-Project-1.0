import User from "../models/user.js";
import HttpError from "../models/http-error.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
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
    
    const {name, email, password} = req.body

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
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12)
    } catch (error) {
        const err = new HttpError(
            "Signing up failed-1, please try again.",
            500
        )
        return next(err)
    }
    const createdUser= new User({
        name,
        email,
        password:hashedPassword,
        image:req.file.path,
        places:[]
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
    let token;
    try {
        token = jwt.sign(
            {userId:createdUser.id, email:createdUser.email},
            "supersecret_dont_share",
            {expiresIn:'1h'}
        )
    } catch (error) {
        const err = new HttpError(
            "Signing up failed-2, please try again.",
            500
        )
        return next(err)
    }
    res.status(201).json({userId:createdUser.id, email:createdUser.email, token:token})

    // res.status(201).json({user:createdUser.toObject({getters:true})})

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
    
    if(!identifiedUser){
       const error = new HttpError('Could not identify user, creadential seem to be wrong', 401)
       return next(error)
    }
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, identifiedUser.password)
    } catch (error) {
        const err = new HttpError(
            "Logging in failed-1, please try again.",
            500
        )
        return next(err)    
    }
    if(!isValidPassword){
        const error = new HttpError('Could not identify user, creadential seem to be wrong', 401)
        return next(error)
    }

    let token;
    try {
        token = jwt.sign(
            {userId:identifiedUser.id, email:identifiedUser.email},
            "supersecret_dont_share",
            {expiresIn:'1h'}
        )
    } catch (error) {
        const err = new HttpError(
            "logging in failed-2, please try again.",
            500
        )
        return next(err)
    }
    res.status(200).json({userId:identifiedUser.id, email:identifiedUser.email, token:token})
};
