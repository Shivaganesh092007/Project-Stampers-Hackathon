import mongoose from 'mongoose';

// 1. Subtopic Schema (Subdocument - lives inside Topic)
const subtopicSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Subtopic title is required'],
		trim: true
	},
	order: {
		type: Number,
		required: true
	},
	theoryContent: {
		type: String,
		required: [true, 'Theory content is required']
	},
	starterCode: {
		type: String,
		default: '// Write your code solution here\n'
	},
}, {
	_id: true,       // Mongoose automatically assigns an _id to each subtopic
	timestamps: true
});

// 2. Topic Schema (Main Collection)
const topicSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Topic title is required'],
		unique: true,
		trim: true
	},
	description: {
		type: String,
		default: ''
	},
	order: {
		type: Number,
		required: true
	},
	subtopics: [
		subtopicSchema
	] // Array of embedded subtopics
}, {
	timestamps: true
});

// Create index for fast subtopic lookup by ID across nested array
topicSchema.index({ "subtopics._id": 1 });

const Topic = mongoose.model('Topic', topicSchema);
export default Topic;