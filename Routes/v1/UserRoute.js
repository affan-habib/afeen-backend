import express from 'express';
import {
  deleteUser,
  following,
  getAlluser,
  getUser,
  unFollowing,
  updateUser
} from '../../Controllers/v1/UserControlller.js';
import authMiddleWare from '../../MiddleWare/authMiddleWare.js';

import upload from '../../utils/multer.js';

const router = express.Router();
router.get('/', getAlluser);
router.get('/:id', getUser);
router.put('/:id', authMiddleWare, upload.any(), updateUser);
router.delete('/:id', authMiddleWare, deleteUser);
router.put('/:id/follow', authMiddleWare, following);
router.put('/:id/unfollow', authMiddleWare, unFollowing);

export default router;
