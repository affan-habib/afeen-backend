import mongoose from 'mongoose';
//import PostModel from '../../Models/postModel.js';
import PostModel from '../../Models/postModel.js';
import UserModel from '../../Models/userModel.js';
import catchAsync from '../../utils/catchAsync.js';
import cloudinary from '../../utils/cloudinary.js';
import uploadSingleImageToCloudinary from '../../utils/uploadImage.js';

export const createPost = catchAsync(async (req, res) => {
  if (req?.file?.path) {
    const result = await uploadSingleImageToCloudinary(req.file.path, {
      folder: 'postImage'
    });

    const post = {
      userId: req.body?.userId,
      desc: req.body?.desc,
      image: result?.url,
      cloudinaryImgId: result?.public_id
    };

    const newPost = new PostModel(post);
    await newPost.save();
    res.status(200).json(newPost);
  } else {
    const newPost = new PostModel(req.body);
    await newPost.save();
    res.status(200).json(newPost);
  }
});

export const getPost = catchAsync(async (req, res) => {
  const id = req.params.id;
  const doc = await PostModel.findById(id);
  res.status(200).json(doc);
});

export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;
  try {
    const post = await PostModel.findById(postId);
    if (post.userId == userId) {
      if (req?.file?.path) {
        const cloudinaryDeleteResult = await cloudinary.uploader.destroy(
          post.cloudinaryImgId
        );
        const imageUpdated = await uploadSingleImageToCloudinary(
          req.file.path,
          {
            folder: 'postImage'
          }
        );

        const updatedPost = {
          userId: req.body.userId,
          desc: req.body.desc,
          image: imageUpdated.secure_url,
          cloudinaryImgId: imageUpdated.public_id
        };

        const updateToDb = await post.updateOne({ $set: updatedPost });
        res.status(200).json({
          message: 'post updated successfully which is contain image! Wow',
          imageDeletedResult: cloudinaryDeleteResult,
          imageUpdatedResult: imageUpdated,
          databaseUpdateResult: updateToDb
        });
      } else {
        await post.updateOne({ $set: req.body });
        res
          .status(200)
          .json('post updated successfully which does not contain image! Wow');
      }
    } else {
      res.status(401).json("You can't update in this post");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;
  try {
    const post = await PostModel.findById(postId);

    if (post.userId === userId) {
      if (post?.cloudinaryImgId) {
        await cloudinary.uploader.destroy(post.cloudinaryImgId);
      }
      await post.deleteOne();
      res.status(200).json('post delete successfully');
    } else {
      res.status(401).json("You can't delete in this post");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likeUnlikePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json('post liked successfully');
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json('post unliked successfully');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const currentUserPosts = await PostModel.find({ userId: userId });
    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'following',
          foreignField: 'userId',
          as: 'followingPosts'
        }
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0
        }
      }
    ]);
    res.status(200).json(
      currentUserPosts
        .concat(...followingPosts[0].followingPosts)
        .sort((a, b) => {
          return b.createdAt - a.createdAt;
        })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
