import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type:     String,
    enum:     ['tutor', 'student', 'verifier', 'doubt'],
    required: true
  },
  content: { type: String, required: true },

  metadata: {
    theoryShown:      { type: String },
    problemStatement: { type: String },
    userSolution:     { type: String },
    isCorrect:        { type: Boolean },
    aiPayload: {
      hasErrors:                 { type: Boolean },
      mistakes:                  [String],
      misconceptions:            [String],
      suggestionsForImprovement: [String]
    }
  }
}, { timestamps: true });

const conversationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
  courseId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

  title:    { type: String, default: "" },
  topic:    { type: String, required: true },
  subtopic: { type: String, required: true },

  messages: [messageSchema],

  status: {
    type:    String,
    enum:    ['active', 'completed', 'abandoned'],
    default: 'active'
  }
}, { timestamps: true });

export default mongoose.model('Conversation', conversationSchema);