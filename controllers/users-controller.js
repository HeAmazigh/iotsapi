const HttpError = require('../models/http-error');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Op} = require('sequelize');

const { validationResult } = require('express-validator');

const User = require('../models/User');

const singup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Errorrrrrr ',errors);
        return next(new HttpError('Invalid inputs', 422));
    }

    const {firstname, lastname, username, password, email} = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    {email: email},
                    {username: username}
                ]
            }});
    } catch (error) {
        return next(new HttpError('Singup field, plase try again lllllllater! ', 422));
    }

    if (existingUser) {
        return next(new HttpError('E-mail address already exist!', 422));
    }

    let hashPassword;
    try {
        hashPassword = await bcrypt.hash(password, 10);
        console.log('passssssssswoooooooord ',hashPassword);
    } catch (error) {
        return next(new HttpError('Could not create user, Please try again! ', 500));
    }

    let createUser;
    try {
        createUser = await User.create({
            firstname,
            lastname,
            username,
            password: hashPassword,
            email
        });
    } catch (error) {
        console.log('errorrrrr ', error)
        return next(new HttpError('Singin up field, plase try again laaaaaaater! ', 500));
    }

    let token;
    try {
        token = jwt.sign({
            userId: createUser.id,
            email: createUser.email
        },
        process.env.JWT_KEY ,
        {
            expiresIn: '1h'
        })
    } catch (error) {
        return next(new HttpError('Singin up field, plase try again kater! ', 500));
    }
    res.status(201).json({userId: createUser.id, email: createUser.email, token: token});
}

const login = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({where: {email: email}});
    } catch (error) {
        return next(new HttpError('Login field, plase try again ater! ', 500));
    }

    if (!existingUser) {
        return next(new HttpError('Credentials not match', 403));
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password); 
    } catch (error) {
        return next(new HttpError('Could not log you in! Please try again', 500));
    }
    if (!isValidPassword) {
        return next(new HttpError('Credentials not match', 403));
    }
    let token;
    try {
        token = jwt.sign({
            userId: existingUser.id,
            email: existingUser.email
        },
        process.env.JWT_KEY ,
        {
            expiresIn: '1h'
        })
    } catch (error) {
        return next(new HttpError('Singin up field, plase try again kater! ', 500));
    }
    res.status(201).json({userId: existingUser.id, email: existingUser.email, token: token});
}


exports.login = login;
exports.singup = singup;