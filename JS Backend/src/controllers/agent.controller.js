import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import StudentKnowledge from '../models/StudentKnowledge.js';
import EvaluationLog from '../models/EvaluationLog.js';
import DoubtChat from '../models/DoubtChat.js';
import { processDoubtAgent } from '../services/aiAgentService.js';
import axios from 'axios';

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';

/**
 * POST /api/agent/main/chat
 */
export const handleMainAgentChat = asyncHandler(async (req, res) => {
    const { studentId, subtopicId, message, course, presentTopic, presentSubtopic } = req.body;

    let knowledge = await StudentKnowledge.findOne({ studentId, subtopicId });
    if (!knowledge) {
        knowledge = await StudentKnowledge.create({
            studentId,
            subtopicId,
            status: 'in_progress'
        });
    } else if (knowledge.status === 'not_done') {
        knowledge.status = 'in_progress';
    }

    if (message) {
        knowledge.messages.push({ sender: 'student', text: message });
    }

    const pyResponse = await axios.post(`${PYTHON_SERVICE_URL}/agent/main`, {
        course: course || "DSA",
        present_topic: presentTopic,
        present_subtopic: presentSubtopic,
        problem_statement: "",
        covered_topics: [],
        covered_subtopics: []
    });

    const aiTheory = pyResponse.data.theory;
    const problemStmt = pyResponse.data.problem_statement;
    const combinedReply = `${aiTheory}\n\n**Practice Challenge:**\n${problemStmt}`;

    knowledge.messages.push({ sender: 'ai', text: combinedReply });
    await knowledge.save();

    return res.status(200).json(
        new ApiResponse(200, { reply: combinedReply, history: knowledge.messages }, "Main agent response generated")
    );
});

/**
 * GET /api/agent/main/history/:studentId/:subtopicId
 */
export const getMainAgentHistory = asyncHandler(async (req, res) => {
    const { studentId, subtopicId } = req.params;
    const record = await StudentKnowledge.findOne({ studentId, subtopicId });
    return res.status(200).json(
        new ApiResponse(200, record ? record.messages : [], "Main agent chat history retrieved")
    );
});

/**
 * POST /api/agent/evaluate
 */
export const evaluateCodeSubmission = asyncHandler(async (req, res) => {
    const { studentId, subtopicId, problemStatement, isDsa, userSolution, userQuery } = req.body;

    const pyResponse = await axios.post(`${PYTHON_SERVICE_URL}/agent/evaluate`, {
        problem_statement: problemStatement,
        is_dsa: isDsa ?? true,
        user_solution: userSolution,
        user_query: userQuery || ""
    });

    const { tutor_reply, backend_db_payload } = pyResponse.data;
    const isCorrect = !backend_db_payload.has_errors;
    const calculatedScore = isCorrect ? 100 : 40;

    const attemptCount = await EvaluationLog.countDocuments({ studentId, subtopicId });

    const evaluationLog = await EvaluationLog.create({
        studentId,
        subtopicId,
        attemptNumber: attemptCount + 1,
        submittedCode: userSolution,
        isCorrect,
        score: calculatedScore,
        misconceptionsIdentified: (backend_db_payload.misconceptions || []).map(m => ({
            tag: m,
            explanation: m,
            severity: 'moderate'
        })),
        aiFeedback: {
            explanation: tutor_reply,
            remedialHint: (backend_db_payload.suggestions_for_improvement || []).join('\n')
        }
    });

    let knowledge = await StudentKnowledge.findOne({ studentId, subtopicId });
    if (!knowledge) {
        knowledge = new StudentKnowledge({ studentId, subtopicId });
    }

    knowledge.attemptCount += 1;
    knowledge.lastEvaluatedAt = new Date();
    knowledge.masteryScore = Math.max(knowledge.masteryScore, calculatedScore);

    if (isCorrect) {
        knowledge.status = 'completed';
    } else {
        knowledge.status = 'in_progress';
        
        (backend_db_payload.misconceptions || []).forEach(tag => {
            const existing = knowledge.detectedMisconceptions.find(m => m.misconceptionTag === tag);
            if (existing) {
                existing.frequencyCount += 1;
                existing.lastObservedAt = new Date();
            } else {
                knowledge.detectedMisconceptions.push({
                    misconceptionTag: tag,
                    description: tag
                });
            }
        });
    }

    await knowledge.save();

    return res.status(200).json(
        new ApiResponse(200, {
            evaluationLog,
            tutorReply: tutor_reply,
            masteryScore: knowledge.masteryScore,
            status: knowledge.status
        }, "Code evaluated successfully")
    );
});

/**
 * GET /api/agent/evaluate/history/:studentId/:subtopicId
 */
export const getEvaluationHistory = asyncHandler(async (req, res) => {
    const { studentId, subtopicId } = req.params;
    const logs = await EvaluationLog.find({ studentId, subtopicId }).sort({ createdAt: -1 });
    return res.status(200).json(
        new ApiResponse(200, logs, "Evaluation logs retrieved")
    );
});

/**
 * POST /api/agent/doubt/chat
 */
export const handleDoubtAgentChat = asyncHandler(async (req, res) => {
    const { studentId, subtopicId, course, topic, subtopic, theoryResponse, query } = req.body;

    if (!query) {
        throw new ApiError(400, "Query is required for Doubt Agent");
    }

    const result = await processDoubtAgent({
        studentId,
        subtopicId,
        course,
        topic,
        subtopic,
        theoryResponse,
        query
    });

    return res.status(200).json(
        new ApiResponse(200, result, "Doubt reply generated")
    );
});

/**
 * GET /api/agent/doubt/history/:studentId/:subtopicId
 */
export const getDoubtAgentHistory = asyncHandler(async (req, res) => {
    const { studentId, subtopicId } = req.params;
    const chatRecord = await DoubtChat.findOne({ studentId, subtopicId });
    return res.status(200).json(
        new ApiResponse(200, chatRecord ? chatRecord.messages : [], "Doubt agent chat history retrieved")
    );
});