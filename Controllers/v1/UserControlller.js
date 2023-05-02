import UserModel from '../../Models/userModel.js';
import uploadSingleImageToCloudinary from '../../utils/uploadImage.js';
import jwt from 'jsonwebtoken';

export const getAlluser = async (req, res) => {
  try {
    let users = await UserModel.find();
    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails);
    } else {
      res.status(404).json('user does not exits');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  if (id === _id) {
    try {
      let profileImageUpdated;
      let coverImageUpdated;

      if (req?.files) {
        if (req?.files[0]?.fieldname === 'profileImage') {
          profileImageUpdated = await uploadSingleImageToCloudinary(
            req?.files[0]?.path,
            {
              folder: 'profileImage'
            }
          );
        }
        if (req?.files[0]?.fieldname === 'coverImage') {
          coverImageUpdated = await uploadSingleImageToCloudinary(
            req.files[0]?.path,
            {
              folder: 'coverImage'
            }
          );
        }
        if (req?.files[1]?.fieldname === 'coverImage') {
          coverImageUpdated = await uploadSingleImageToCloudinary(
            req.files[1]?.path,
            {
              folder: 'coverImage'
            }
          );
        }
      }

      const updateData = {
        firstName: req.body?.firstName,
        lastName: req.body?.lastName,
        worksAt: req.body?.worksAt,
        country: req.body?.country,
        livesIn: req.body?.livesIn,
        relationship: req.body?.relationship,
        cloudinaryImgIdProfile: profileImageUpdated?.public_id,
        profilePicture: profileImageUpdated?.secure_url,
        cloudinaryImgIdCover: coverImageUpdated?.public_id,
        coverPicture: coverImageUpdated?.secure_url
      };

      const user = await UserModel.findOneAndUpdate(
        id,
        { $set: updateData },
        {
          new: true,
          upsert: true,
          useFindAndModify: false
        }
      );

      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWT_KEY,
        { expiresIn: '1h' }
      );

      res.status(200).json({
        user,
        token
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(401).json('Access Denied!');
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currenUserAdminStatus } = req.body;
  if (currentUserId || currenUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json('User deleted successfully');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(401).json('Access Denied!');
  }
};

export const following = async (req, res) => {
  const iWantToFollowUserId = req.params.id;
  const { _id } = req.body;
  if (_id === iWantToFollowUserId) {
    res.status(403).json('Action forbidden! You cant followed by you');
  } else {
    try {
      const followUser = await UserModel.findById(iWantToFollowUserId);
      const followingByMe = await UserModel.findById(_id);
      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingByMe.updateOne({
          $push: { following: iWantToFollowUserId }
        });
        res.status(200).json('Following successfully complete!');
      } else {
        res.status(403).json('User is Already present in your following list');
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
export const unFollowing = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  if (_id === id) {
    res
      .status(403)
      .json('Action forbidden! you cant able to unfollowing yourself');
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);
      if (followUser.followers.includes(_id)) {
        await followUser.updateOne({ $pull: { followers: _id } });
        await followingUser.updateOne({ $pull: { following: id } });
        res
          .status(200)
          .json('User unfollowed Successfully! You will miss his/her activity');
      } else {
        res.status(403).json('This user is not in your following list');
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
