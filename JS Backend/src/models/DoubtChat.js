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

const doubtChatSchema = new mongoose.Schema({
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
	// Connects active chat context to the student's latest code evaluation attempt
	activeEvaluationId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'EvaluationLog'
	},
	messages: [
		messageSchema
	]
}, {
	timestamps: true
});

doubtChatSchema.index({ studentId: 1, subtopicId: 1 }, { unique: true });

const DoubtChat = mongoose.model('DoubtChat', doubtChatSchema);
export default DoubtChat;