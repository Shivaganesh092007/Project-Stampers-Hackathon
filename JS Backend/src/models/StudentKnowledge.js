import mongoose from 'mongoose';

const misconceptionDetailSchema = new mongoose.Schema({
	misconceptionTag: {
		type: String,
		required: true // e.g., 'OFF_BY_ONE', 'MUTATING_STATE_DIRECTLY', 'SCOPE_LEAK'
	},
	description: {
		type: String,
		required: true
	},
	frequencyCount: {
		type: Number,
		default: 1 // Increments if student repeats the same error
	},
	firstObservedAt: {
		type: Date,
		default: Date.now
	},
	lastObservedAt: {
		type: Date,
		default: Date.now
	},
	isResolved: {
		type: Boolean,
		default: false // Updated when Evaluation Agent confirms student overcame it
	}
});

const studentKnowledgeSchema = new mongoose.Schema({
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
	status: {
		type: String,
		enum: ['not_done','in_progress', 'completed'],
		default: 'not_done'
	},
	masteryScore: {
		type: Number,
		min: 0,
		max: 100,
		default: 0
	},
	attemptCount: {
		type: Number,
		default: 0
	},
	detectedMisconceptions: [
		misconceptionDetailSchema
	],
	lastEvaluatedAt: {
		type: Date
	}
}, {
	timestamps: true
});

studentKnowledgeSchema.index({ studentId: 1, subtopicId: 1 }, { unique: true });

const StudentKnowledge = mongoose.model('StudentKnowledge', studentKnowledgeSchema);
export default StudentKnowledge;