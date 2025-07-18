const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const User = require("../models/user");

const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Max Schwarz",
    email: "test@test.com",
    password: "testers",
  },
];

const getUsers = async (req, res, next) => {
  // res.json({ users: DUMMY_USERS });

  let users;
  try {
    users = await User.find({}, "-password");
  } catch {
    const error = new HttpError("Fetching users failed,please try again later");
    return next(error);
  }

  res.json({ users: users.map((u) => u.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //console.log(errors);
    // throw new HttpError("Invalid inputs passed , please check your data", 422);
    return next(
      new HttpError("Invalid inputs passed , please check your data", 422)
    ); //in async functions we use return next() and not throw
  }

  const { name, email, password } = req.body;

  // const hasUser = DUMMY_USERS.find((u) => u.email === email);
  // if (hasUser) {
  //   throw new HttpError("Could not create user, email already exists.", 422); //422 for invalid user input
  // }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email }); //checking if a particular email exists in database
  } catch (err) {
    const error = new HttpError("Signup failed,please try again later", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User already exists,please login instead",
      422
    );
    return next(error);
  }

  // const createdUser = {
  //   id: uuidv4(),
  //   name, // name: name
  //   email,
  //   password,
  // };

  const createdUser = new User({
    name,
    email,
    password,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",

    places: [],
  });

  // DUMMY_USERS.push(createdUser);

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing Up failed ,please try again", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  // const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  // if (!identifiedUser || identifiedUser.password !== password) {
  //   throw new HttpError(
  //     "Could not identify user, credentials seem to be wrong.",
  //     401
  //   ); // 401 for invalid credentials
  // }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email }); //checking if a particular email exists in database
  } catch (err) {
    const error = new HttpError(
      "Logging in failed,please try again later",
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials,could not log you in",
      401
    );
    return next(error);
  }

  res.json({
    message: "Logged in!",
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
