// const { validationResult } = require("express-validator");
// const { v4: uuidv4 } = require("uuid");
// const Place = require("../models/place");
// const User = require("../models/user");
// const mongoose = require("mongoose");

// const HttpError = require("../models/http-error");
// const mongooseUniqueValidator = require("mongoose-unique-validator");

// let DUMMY_PLACES = [
//   {
//     id: "p1",
//     title: "Empire State Building",
//     description: "One of the famous sky scrapers in the world",
//     imageUrl:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
//     address: "20 W 34th St, New York, NY 10001",
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584,
//     },
//     creator: "u1",
//   },
// ];

// const getPlaceById = async (req, res, next) => {
//   const placeId = req.params.pid; //{pid : 'p1'}
//   // const place = DUMMY_PLACES.find((p) => {
//   //   return p.id === placeId;
//   // });

//   let place;
//   try {
//     place = await Place.findById(placeId);
//   } catch (err) {
//     const error = new HttpError("Coud not get the place,try again", 500);
//     return next(error);
//   }

//   if (!place) {
//     const error = new HttpError(
//       "Could not find place for the provided id",
//       404
//     );
//     return next(error);
//     // or
//     //throw HttpError('Could not find place fro the provided id',404);
//   }

//   res.json({ place: place.toObject({ getters: true }) }); //   {place} => {place:place}
// };

// getPlacesByUserId = async (req, res, next) => {
//   const userId = req.params.uid;
//   // const places = DUMMY_PLACES.filter((p) => {
//   //   return p.creator === userId;
//   // });

//   let places;
//   try {
//     places = await Place.find({ creator: userId });
//   } catch (err) {
//     const error = new HttpError("Fetching places failed,please try again", 500);
//     return next(error);
//   }

//   if (!places || places.length === 0) {
//     return next(
//       new HttpError("Could not find places for the provided user id", 404)
//     );
//   }

//   res.json({
//     places: places.map(
//       (p) => p.toObject({ getters: true }) //getters is used to get the ifd without the underscore
//     ), //Converting mongoose object to normal javascript object
//   });
// };

// const createPlace = async (req, res, next) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     //console.log(errors);
//     throw new HttpError("Invalid inputs passed , please check your data", 422);
//   }

//   const { title, description, coordinates, address, creator } = req.body;
//   // const title = req.body.title;

//   //Earlier done while working with node express
//   // const createdPlace = {
//   //   id: uuidv4(),
//   //   title: title, //simply title since both have same names
//   //   description,
//   //   location: coordinates,
//   //   address,
//   //   creator,
//   // };

//   //DUMMY_PLACES.push(createdPlace);

//   const createdPlace = new Place({
//     //creating a new instace of the class Place i.e. model
//     //Model
//     title,
//     description,
//     address,
//     location: coordinates,
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",

//     creator,
//   });

//   let user;
//   try {
//     user = await User.findById(creator);
//   } catch (err) {
//     const error = new HttpError("Could not create place,process failed", 500);
//     return next(error);
//   }

//   if (!user) {
//     //checking if the user data is not present in database
//     const error = new HttpError("Could not find user for that id", 404);
//     return next(error);
//   }

//   console.log(user);

//   try {
//     const sess = await mongoose.startSession();
//     sess.startTransaction();
//     await createdPlace.save({ session: sess });
//     user.places.push(createdPlace);
//     await user.save({ session: sess });
//     await sess.commitTransaction();
//   } catch (err) {
//     const error = new HttpError("Could not create place,please try again", 500);
//     return next(error);
//   }

//   res.status(201).json({ place: createdPlace }); //errrr code is 201 when we create something new
// };

// const updatePlaceById = async (req, res, next) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return next(
//       new HttpError("Invalid inputs passed , please check your data", 422)
//     );
//   }

//   const { title, description } = req.body;
//   const placeId = req.params.pid;

//   // const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };

//   // const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);

//   // updatedPlace.title = title;
//   // updatedPlace.description = description;

//   let place;
//   try {
//     place = await Place.findById(placeId);
//   } catch {
//     const error = new HttpError(
//       "Something went wrong,could not update place",
//       500
//     );

//     return next(error);
//   }

//   place.title = title;
//   place.description = description;

//   // DUMMY_PLACES[placeIndex] = updatedPlace;

//   //Making sure that the place is updated in the database as well

//   try {
//     await place.save();
//   } catch (err) {
//     const error = new HttpError("Could not update place in database", 500);
//     return next(error); //Making sure the code execution is interrupted and the code does not keeps on executing
//   }

//   res.status(200).json({ place: place.toObject({ getters: true }) });
// };

// const deletePlaceById = async (req, res, next) => {
//   const placeId = req.params.pid;

//   // if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
//   //   throw new HttpError("Could not find the place for that id", 404);
//   // }

//   // DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

//   let place;
//   try {
//     place = await Place.findById(placeId).populate("creator"); //will delete creator id for that place
//   } catch (err) {
//     const error = new HttpError("Could not delete place", 500);
//     return next(error);
//   }

//   if (!place) {
//     const error = new HttpError("Could not find place for this id", 404);
//     return next(error);
//   }

//   //Deleting the place from database
//   try {
//     const sess = await mongoose.startSession();
//     sess.startTransaction();
//     await place.remove({ session: sess });
//     place.creator.places.pull(place);
//     await place.creator.save({ session: sess });
//     await sess.commitTransaction();
//   } catch (err) {
//     const error = new HttpError("Could not delete place from database", 500);
//     return next(error);
//   }

//   res.status(200).json({ message: "Deleted place" });
// };

// exports.getPlaceById = getPlaceById;
// exports.getPlacesByUserId = getPlacesByUserId;
// exports.createPlace = createPlace;
// exports.updatePlaceById = updatePlaceById;
// exports.deletePlaceById = deletePlaceById;

// const uuid = require("uuid/v4");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
// const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; //{pid : 'p1'}
  // const place = DUMMY_PLACES.find((p) => {
  //   return p.id === placeId;
  // });

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Coud not get the place,try again", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find place for the provided id",
      404
    );
    return next(error);
    // or
    //throw HttpError('Could not find place fro the provided id',404);
  }

  res.json({ place: place.toObject({ getters: true }) }); //   {place} => {place:place}
};

getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  // const places = DUMMY_PLACES.filter((p) => {
  //   return p.creator === userId;
  // });

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError("Fetching places failed,please try again", 500);
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id", 404)
    );
  }

  res.json({
    places: places.map(
      (p) => p.toObject({ getters: true }) //getters is used to get the ifd without the underscore
    ), //Converting mongoose object to normal javascript object
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, coordinates, address, creator } = req.body;

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg", // => File Upload module, will be replaced with real image url
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
