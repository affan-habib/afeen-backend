import mongoose from 'mongoose';
const resumeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter a title.']
  },
  about: {
    type: String,
    required: [true, 'Please enter an about.']
  },
  educations: [{
    institution: {
      type: String,
      required: [true, 'Please enter the name of the institution.']
    },
    degree: {
      type: String,
      required: [true, 'Please enter the degree obtained.']
    },
    fieldOfStudy: {
      type: String,
      required: [true, 'Please enter the field of study.']
    },
    graduationDate: {
      type: Date,
      required: [true, 'Please enter the date of graduation.']
    }
  }],
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
