import express from 'express';
import  {
  getAllResumes,
  createResume,
  getResumeById,
  updateResumeById,
  deleteResumeById,
  searchResumes
} from '../../Controllers/v1/ResumeController.js';

const router = express.Router();

// Get all 
router.get('/', getAllResumes);

// Create a new user
router.post('/', createResume);

// Get a user by ID
router.get('/:id', getResumeById);

// Update a user by ID
router.put('/:id', updateResumeById);

// Delete a user by ID
router.delete('/:id', deleteResumeById);

// Search and filter 
router.get('/search', searchResumes);

export default router;
