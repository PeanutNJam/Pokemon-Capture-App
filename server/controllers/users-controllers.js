const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');


const getUser = async (req, res, next) => {

    const id = req.params.id

    try {
      const user = await User.findById(id);
      res.status(200).json(user);
    } catch (err) {
      const error = new HttpError(
        'Fetching user failed, please try again later.',
        404
      );
      return next(error);
    }
};

const signup = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
          );
    }

    const { username, password } = req.body;


    let existingUser
    try {
        existingUser = await User.findOne({ username: username })
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError(
            'User exists already, please login instead.',
            422
        );
        return next(error)
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError('Could not create user, please try again.',
        500
      );
      return next(error);
    };
    


    const createdUser = new User({
        username,
        password: hashedPassword
    });

    try {
        await createdUser.save()
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again.',
            500
        );
        return next(error);
    }

    let token;
    try {
      token = jwt.sign({userId: createdUser.id},
        'supersecret_dont_share', 
        {expiresIn: '1h'}
      );    // id provided by mongoose
    } catch (err) {
      const error = new HttpError(
        'Signing up failed, please try again.',
        500
      );
      return next(error);
    }

    res
      .status(201)
      .json({ userId: createdUser.id, token: token });
};


const login = async (req, res, next) => {
    const { username, password } = req.body;
  
    let existingUser;
  
    try {
      existingUser = await User.findOne({ username: username })
    } catch (err) {
      const error = new HttpError(
        'Logging in failed, please try again later.',
        500
      );
      return next(error);
    }
  
    if (!existingUser) {
      const error = new HttpError(
        'Username does not exist',
        401
      );
      return next(error);
    }
    
    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError('Could not log you in, please check your credentials and try',
        500
      );
      return next(error);
    }

    if (!isValidPassword) {
      const error = new HttpError(
        'Wrong Password, Please try again.',
        401
      );
      return next(error);
    }

    let token;
    try {
      token = jwt.sign({userId: existingUser.id, username: existingUser.username },
        'supersecret_dont_share', 
        {expiresIn: '1h'}
      );    // id provided by mongoose
    } catch (err) {
      const error = new HttpError(
        'Logging in failed, please try again.',
        500
      );
      return next(error);
    }

    res.json({ 
      userId: existingUser.id, 
      username: existingUser.username, 
      token: token 
    });
};

exports.getUser = getUser;
exports.signup = signup;
exports.login = login;
