import express from 'express';
import  {
  getAllRecipes,
  createRecipe,
  getRecipeById,
  updateRecipeById,
  deleteRecipeById,
  searchRecipes
} from '../../Controllers/v1/RecipeController.js';

const router = express.Router();

// Get all 
router.get('/', getAllRecipes);

// Create a new user
router.post('/', createRecipe);

// Get a user by ID
router.get('/:id', getRecipeById);

// Update a user by ID
router.put('/:id', updateRecipeById);

// Delete a user by ID
router.delete('/:id', deleteRecipeById);

// Search and filter 
router.get('/search', searchRecipes);

export default router;
