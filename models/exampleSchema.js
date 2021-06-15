import mongoose from "mongoose"

// Schema
const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: String,
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: Number,
    enum: [0, 1],
    default: 0,
    required: true
  },
  friends: [{
    type: String,
  }]
})

// Virtuals
UserSchema.virtual("fullName").get(function() {
  return this.firstName + this.lastName
})

// Methods
UserSchema.methods.getGender = function() {
  return this.gender > 0 ? "Male" : "Female"
}

// Static methods
UserSchema.statics.findWithUserName = function(id) {
  return this.findById(id).populate("username").exec()
}

const User = mongoose.model("User", UserSchema);

export default User;