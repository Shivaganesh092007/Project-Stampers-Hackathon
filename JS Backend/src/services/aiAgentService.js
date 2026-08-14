import axios from 'axios';
import AgentChat from '../models/DoubtChat.js';

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';

/**
 * Executes Doubt Agent query with persistent MongoDB chat history
 */
export const processDoubtAgent = async ({ studentId, subtopicId, course, topic, subtopic, theoryResponse, query }) => {
  // 1. Retrieve or create chat history record
  let chatRecord = await AgentChat.findOne({ studentId, subtopicId, agentType: 'doubt' });

  if (!chatRecord) {
    chatRecord = await AgentChat.create({
      studentId,
      subtopicId,
      agentType: 'doubt',
      messages: []
    });
  }

  // 2. Add current user message to local array before sending
  const existingHistory = chatRecord.messages.slice(-10); // Take last 10 messages for context window

  // 3. Call Python Microservice
  const pythonResponse = await axios.post(`${PYTHON_SERVICE_URL}/agent/doubt`, {
    course,
    topic,
    subtopic,
    theoryResponse,
    query,
    chat_history: existingHistory
  });

  const aiReplyText = pythonResponse.data.reply;

  // 4. Save both user query and AI response to MongoDB
  chatRecord.messages.push(
    { sender: 'student', text: query },
    { sender: 'ai', text: aiReplyText }
  );
  await chatRecord.save();

  return {
    reply: aiReplyText,
    fullHistory: chatRecord.messages
  };
};

/**
 * Fetches Chat History for any agent type
 */
export const getAgentChatHistory = async (studentId, subtopicId, agentType = 'doubt') => {
  const chatRecord = await AgentChat.findOne({ studentId, subtopicId, agentType });
  return chatRecord ? chatRecord.messages : [];
};