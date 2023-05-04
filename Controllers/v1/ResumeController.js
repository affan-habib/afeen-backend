import Resume from '../../Models/resumeModel.js';

// Get all resumes
export const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find();
    res.status(200).json({
      status: 'success',
      results: resumes.length,
      data: {
        resumes
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Get a resume by ID
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        resume
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Resume not found'
    });
  }
};

// Create a new resume
export const createResume = async (req, res) => {
  try {
    const resume = await Resume.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        resume
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Update a resume by ID
export const updateResumeById = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        resume
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Delete a resume by ID
export const deleteResumeById = async (req, res) => {
  try {
    await Resume.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Resume not found'
    });
  }
};

// Search and filter resumes by category and/or ingredients
export const searchResumes = async (req, res) => {
  try {
    const { category, ingredients } = req.query;
    let query = {};
    if (category) {
      query.category = category;
    }
    if (ingredients) {
      query.ingredients = { $all: ingredients.split(',') };
    }
    const resumes = await Resume.find(query);
    res.status(200).json({
      status: 'success',
      data: {
        resumes
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};
