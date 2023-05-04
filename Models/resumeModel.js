import mongoose from 'mongoose';
const resumeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter a title.']
  },
  about: {
    type: String,
    required: [true, 'Please enter a about.']
  },
  educations: {
    type: [String],
    required: [true, 'Please enter ingredients.']
  },
  category: {
    type: String,
    required: [true, 'Please enter a category.']
  },
  skills: {
    type: [String],
    required: [true, 'Please enter skills.']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
