import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Topic from '../models/Curriculum.js';
import StudentKnowledge from '../models/StudentKnowledge.js';

/**
 * GET /api/pathway/tree
 * Fetches static full curriculum (Topics and embedded Subtopics)
 */
export const getFullCurriculumTree = asyncHandler(async (req, res) => {
    const topics = await Topic.find().sort({ order: 1 });
    return res.status(200).json(
        new ApiResponse(200, topics, "Full curriculum tree fetched successfully")
    );
});

/**
 * GET /api/pathway/student/:studentId
 * Fetches dynamic progress status per subtopic ('not_done' | 'in_progress' | 'completed')
 */
export const getStudentProgressTree = asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    const topics = await Topic.find().sort({ order: 1 });
    const studentRecords = await StudentKnowledge.find({ studentId });

    const knowledgeMap = new Map(
        studentRecords.map(record => [record.subtopicId.toString(), record])
    );

    const pathway = topics.map(topic => ({
        _id: topic._id,
        title: topic.title,
        order: topic.order,
        subtopics: topic.subtopics.map(subtopic => {
            const record = knowledgeMap.get(subtopic._id.toString());
            return {
                _id: subtopic._id,
                title: subtopic.title,
                order: subtopic.order,
                status: record ? record.status : 'not_done',
                masteryScore: record ? record.masteryScore : 0
            };
        })
    }));

    return res.status(200).json(
        new ApiResponse(200, pathway, "Student progress tree retrieved successfully")
    );
});