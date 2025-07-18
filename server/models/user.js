const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

//Creating the schema and the model for database
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, //unique:to query emails as fast as possible in database
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
}); //Square bracket [] because one user can have multiple places

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
