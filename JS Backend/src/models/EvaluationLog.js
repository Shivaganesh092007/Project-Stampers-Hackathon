import mongoose from 'mongoose';

const evaluationMessageSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ['student', 'ai'],
        required: true
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const evaluationLogSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    subtopicId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    attemptNumber: {
        type: Number,
        required: true
    },
    submittedCode: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    misconceptionsIdentified: [{
        tag: { type: String, required: true },
        explanation: { type: String },
        severity: {
            type: String,
            enum: ['minor', 'moderate', 'severe'],
            default: 'moderate'
        }
    }],
    aiFeedback: {
        explanation: { type: String, required: true },
        remedialHint: { type: String, default: '' },
        personalizedLearningPathNote: { type: String, default: '' }
    },
    // Enables chat history for follow-up questions on this code evaluation
    messages: [evaluationMessageSchema],
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const EvaluationLog = mongoose.model('EvaluationLog', evaluationLogSchema);
export default EvaluationLog;