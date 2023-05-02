import express from 'express';
import {
  createPost,
  deletePost,
  getPost,
  getTimelinePosts,
  likeUnlikePost,
  updatePost
} from '../../Controllers/v1/PostController.js';
import upload from '../../utils/multer.js';
const router = express.Router();

router.post('/', upload.single('image'), createPost);
router.get('/:id', getPost);
router.put('/:id', upload.single('image'), updatePost);
router.delete('/:id', deletePost);
router.put('/:id/like', likeUnlikePost);
router.get('/:id/timeline', getTimelinePosts);

export default router;
