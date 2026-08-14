import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
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

const misconceptionDetailSchema = new mongoose.Schema({
	misconceptionTag: {
		type: String,
		required: true 
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
	// Stores main chat history between student and Main Teacher AI Agent
	messages: [
		messageSchema
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