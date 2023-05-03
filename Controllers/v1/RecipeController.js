import Recipe from '../../Models/recipeModel.js';

// Get all recipes
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json({
      status: 'success',
      results: recipes.length,
      data: {
        recipes
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Get a recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        recipe
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Recipe not found'
    });
  }
};

// Create a new recipe
export const createRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        recipe
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Update a recipe by ID
export const updateRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        recipe
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Delete a recipe by ID
export const deleteRecipeById = async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Recipe not found'
    });
  }
};

// Search and filter recipes by category and/or ingredients
export const searchRecipes = async (req, res) => {
  try {
    const { category, ingredients } = req.query;
    let query = {};
    if (category) {
      query.category = category;
    }
    if (ingredients) {
      query.ingredients = { $all: ingredients.split(',') };
    }
    const recipes = await Recipe.find(query);
    res.status(200).json({
      status: 'success',
      data: {
        recipes
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};
