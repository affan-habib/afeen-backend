import mongoose from 'mongoose';
const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter a title.']
  },
  description: {
    type: String,
    required: [true, 'Please enter a description.']
  },
  ingredients: {
    type: [String],
    required: [true, 'Please enter ingredients.']
  },
  category: {
    type: String,
    required: [true, 'Please enter a category.']
  },
  instructions: {
    type: [String],
    required: [true, 'Please enter instructions.']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
