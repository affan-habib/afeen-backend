import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      requried: true
    },
    lastName: {
      type: String,
      requried: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    profilePicture: String,
    cloudinaryImgIdProfile: String,
    coverPicture: String,
    cloudinaryImgIdCover: String,
    about: String,
    livesIn: String,
    worksAt: String,
    relationship: String,
    country: String,
    followers: [],
    following: []
  },
  { timestamps: true }
);

const UserModel = mongoose.model('Users', userSchema);

export default UserModel;
