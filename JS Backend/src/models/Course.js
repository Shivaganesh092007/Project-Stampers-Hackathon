import mongoose from 'mongoose';

const subtopicSchema = new mongoose.Schema({
  name:             { type: String, required: true },
  problemStatement: { type: String, default: "" },
  difficulty:       { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
});

const topicSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  order:     { type: Number },
  subtopics: [subtopicSchema]
});

const courseSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  topics:      [topicSchema]
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);