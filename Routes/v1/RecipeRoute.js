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

// Get all recipes
router.get('/recipes', getAllRecipes);

// Create a new user
router.post('/recipes', createRecipe);

// Get a user by ID
router.get('/recipes/:id', getRecipeById);

// Update a user by ID
router.put('/recipes/:id', updateRecipeById);

// Delete a user by ID
router.delete('/recipes/:id', deleteRecipeById);

// Search and filter recipes
router.get('/recipes/search', searchRecipes);

export default router;
