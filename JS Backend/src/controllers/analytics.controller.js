import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import StudentKnowledge from '../models/StudentKnowledge.js';
import Topic from '../models/Curriculum.js';

/**
 * GET /api/analytics/student/:studentId
 * Calculates overall mastery %, weak topics, and active misconceptions
 */
export const getStudentAnalytics = asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    const records = await StudentKnowledge.find({ studentId });
    const topics = await Topic.find();

    const totalSubtopics = topics.reduce((acc, t) => acc + t.subtopics.length, 0);
    const completedCount = records.filter(r => r.status === 'completed').length;
    const inProgressCount = records.filter(r => r.status === 'in_progress').length;

    // Overall mastery calculation
    const overallMastery = totalSubtopics > 0 
        ? Math.round(records.reduce((acc, r) => acc + r.masteryScore, 0) / totalSubtopics)
        : 0;

    // Filter unresolved misconceptions
    const activeMisconceptions = records.flatMap(r => 
        r.detectedMisconceptions.filter(m => !m.isResolved)
    );

    // Identify weak topics (Topics with average mastery < 60%)
    const weakTopics = [];
    topics.forEach(t => {
        const subIds = t.subtopics.map(st => st._id.toString());
        const matchingRecords = records.filter(r => subIds.includes(r.subtopicId.toString()));
        const avgScore = matchingRecords.length > 0
            ? matchingRecords.reduce((acc, r) => acc + r.masteryScore, 0) / t.subtopics.length
            : 0;
        
        if (avgScore < 60) {
            weakTopics.push({
                topicId: t._id,
                title: t.title,
                averageMasteryScore: Math.round(avgScore)
            });
        }
    });

    return res.status(200).json(
        new ApiResponse(200, {
            overallMasteryPercentage: overallMastery,
            totalSubtopicsInCurriculum: totalSubtopics,
            completedSubtopics: completedCount,
            inProgressSubtopics: inProgressCount,
            notDoneSubtopics: totalSubtopics - completedCount - inProgressCount,
            weakTopics,
            activeMisconceptions
        }, "Student analytics retrieved successfully")
    );
});