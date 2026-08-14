import mongoose from 'mongoose';

const subtopicProgressSchema = new mongoose.Schema({
  subtopic:     { type: String, required: true },
  topic:        { type: String, required: true },
  masteryScore: { type: Number, default: 0, min: 0, max: 100 },
  attemptCount: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },

  misconceptions:            [String],
  mistakes:                  [String],
  suggestionsForImprovement: [String],

  status: {
    type:    String,
    enum:    ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  lastAttemptAt: { type: Date }
});

const studentProgressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
  courseId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

  topicProgress:   [subtopicProgressSchema],

  currentTopic:    { type: String },
  currentSubtopic: { type: String },
  overallProgress: { type: Number, default: 0, min: 0, max: 100 },

  coveredTopics:    [String],
  coveredSubtopics: [String]

}, { timestamps: true });

export default mongoose.model('StudentProgress', studentProgressSchema);