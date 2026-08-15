const API_BASE_URL = 'http://localhost:5000/agent'; // FastAPI Backend URL

let userSession = null;
document.addEventListener('DOMContentLoaded', async () => {
    // Check Auth Session (Mock Auth for Demo)
    const sessionStr = localStorage.getItem('userSession');
    if (!sessionStr) {
        window.location.href = 'auth.html';
        return;
    }
    userSession = JSON.parse(sessionStr);
    
    // Update Profile Name
    const usernameEl = document.querySelector('.username');
    if (usernameEl && userSession.name) {
        usernameEl.innerText = userSession.name;
    }

    // UI Elements
    const courseSetupModal = document.getElementById('course-setup-modal');
    const courseInput = document.getElementById('course-input');
    const generateCourseBtn = document.getElementById('generate-course-btn');
    const courseLoading = document.getElementById('course-loading');
    
    const appContainer = document.getElementById('app-container');
    const sidebarCourseName = document.getElementById('sidebar-course-name');
    const coursePlanList = document.getElementById('course-plan-list');
    
    const currentTopicDisplay = document.getElementById('current-topic-display');
    const currentSubtopicDisplay = document.getElementById('current-subtopic-display');
    const nextSubtopicBtn = document.getElementById('next-subtopic-btn');
    
    const chatMessages = document.getElementById('unified-chat-messages');
    const chatInput = document.getElementById('unified-chat-input');
    const sendChatBtn = document.getElementById('send-chat-btn');
    
    const codeEditor = document.getElementById('unified-code-editor');
    const codeQuery = document.getElementById('unified-code-query');
    const submitCodeBtn = document.getElementById('submit-code-btn');

    // State Variables
    let currentCourse = "";
    let coursePlan = {};
    let topicKeys = [];
    
    let currentTopicIndex = 0;
    let currentSubtopicIndex = 0;
    
    let coveredTopics = [];
    let coveredSubtopics = [];
    
    let currentTheory = ""; // For doubt agent context
    let currentProblemStatement = ""; // For code evaluation

    // 1. Course Generation
    generateCourseBtn.addEventListener('click', async () => {
        const course = courseInput.value.trim();
        if (!course) {
            alert("Please enter a course name.");
            return;
        }

        generateCourseBtn.classList.add('hidden');
        courseLoading.classList.remove('hidden');

        try {
            const response = await fetch(`${API_BASE_URL}/course`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ course_name: course })
            });
            const data = await response.json();
            
            if (data.course_plan) {
                currentCourse = course;
                coursePlan = data.course_plan;
                topicKeys = Object.keys(coursePlan);
                
                sidebarCourseName.innerText = currentCourse;
                renderCoursePlan();
                
                // Store course info (Mock: log to console instead of DB)
                try {
                    console.log("Mock saved course to DB:", {
                        user_id: userSession.id,
                        course_name: currentCourse,
                        course_plan: coursePlan
                    });
                } catch (err) {
                    console.error("Mock insert error:", err);
                }
                
                courseSetupModal.classList.add('hidden');
                appContainer.classList.remove('hidden');
                
                // Start the first subtopic (don't increment index yet)
                nextSubtopicBtn.classList.remove('hidden'); // Ensure button is visible
                await fetchAndDisplaySubtopic();
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            console.error('Error generating course:', error);
            alert("Failed to generate course. Please try again.");
            generateCourseBtn.classList.remove('hidden');
            courseLoading.classList.add('hidden');
        }
    });

    // Render Sidebar Course Plan
    function renderCoursePlan() {
        coursePlanList.innerHTML = '';
        topicKeys.forEach((topic, tIndex) => {
            const btn = document.createElement('div');
            btn.className = `course-topic-btn ${tIndex < currentTopicIndex ? 'completed' : ''} ${tIndex === currentTopicIndex ? 'active' : ''}`;
            btn.innerText = topic;
            coursePlanList.appendChild(btn);

            const subList = document.createElement('div');
            subList.className = 'subtopics-list';
            
            coursePlan[topic].forEach((sub, sIndex) => {
                const isCompleted = tIndex < currentTopicIndex || (tIndex === currentTopicIndex && sIndex < currentSubtopicIndex);
                const isActive = tIndex === currentTopicIndex && sIndex === currentSubtopicIndex;
                
                const subItem = document.createElement('div');
                subItem.className = `subtopic-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`;
                subItem.innerHTML = `${isCompleted ? '✓ ' : (isActive ? '▶ ' : '○ ')}${sub}`;
                subList.appendChild(subItem);
            });
            coursePlanList.appendChild(subList);
        });
    }

    // 2. Start Next Subtopic (Main Agent)
    nextSubtopicBtn.addEventListener('click', async () => {
        // Progress to the next subtopic
        const presentTopic = topicKeys[currentTopicIndex];
        const presentSubtopic = coursePlan[presentTopic][currentSubtopicIndex];
        
        // Mark current as covered
        if (!coveredSubtopics.includes(presentSubtopic)) {
            coveredSubtopics.push(presentSubtopic);
        }
        
        currentSubtopicIndex++;
        if (currentSubtopicIndex >= coursePlan[presentTopic].length) {
            if (!coveredTopics.includes(presentTopic)) {
                coveredTopics.push(presentTopic);
            }
            currentTopicIndex++;
            currentSubtopicIndex = 0;
        }
        
        await fetchAndDisplaySubtopic();
    });

    async function fetchAndDisplaySubtopic() {
        
        if (currentTopicIndex >= topicKeys.length) {
            appendMessage(chatMessages, "🎉 Congratulations! You have completed the course!", 'ai');
            return;
        }

        const presentTopic = topicKeys[currentTopicIndex];
        const subtopics = coursePlan[presentTopic];
        const presentSubtopic = subtopics[currentSubtopicIndex];

        currentTopicDisplay.innerText = `Topic: ${presentTopic}`;
        currentSubtopicDisplay.innerText = `Subtopic: ${presentSubtopic}`;
        renderCoursePlan(); // update active styling

        const loader = appendMessage(chatMessages, `Generating lesson for **${presentSubtopic}**...`, 'ai');

        try {
            const response = await fetch(`${API_BASE_URL}/main`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    course: currentCourse,
                    present_topic: presentTopic,
                    present_subtopic: presentSubtopic,
                    problem_statement: "",
                    covered_topics: coveredTopics,
                    covered_subtopics: coveredSubtopics
                })
            });
            const data = await response.json();
            loader.remove();

            if (data.theory || data.problem_statement) {
                currentTheory = data.theory || "";
                currentProblemStatement = data.problem_statement || "";
                
                const replyText = `${currentTheory}\n\n**Practice Challenge:**\n${currentProblemStatement}`;
                appendMessage(chatMessages, replyText, 'ai');
                
                // Pre-fill a comment in the editor
                codeEditor.value = `# Write your solution for: ${presentSubtopic}\n\ndef solution():\n    pass`;
            } else {
                appendMessage(chatMessages, `Error: Failed to fetch lesson content.`, 'ai');
            }
        } catch (error) {
            console.error('Main agent error:', error);
            loader.remove();
            appendMessage(chatMessages, 'Error communicating with server.', 'ai');
        }
    }

    // 3. unified Chat Routing (Doubt Agent)
    sendChatBtn.addEventListener('click', sendDoubt);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendDoubt();
    });

    async function sendDoubt() {
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage(chatMessages, text, 'user');
        chatInput.value = '';

        const loader = appendMessage(chatMessages, '...', 'ai');
        
        const presentTopic = topicKeys[currentTopicIndex];
        const subtopics = coursePlan[presentTopic];
        
        // Safety check if we somehow exceed
        if (subtopics && currentSubtopicIndex >= subtopics.length) return;
        
        const presentSubtopic = subtopics[currentSubtopicIndex];

        try {
            const response = await fetch(`${API_BASE_URL}/doubt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    course: currentCourse,
                    topic: presentTopic,
                    subtopic: presentSubtopic,
                    theoryResponse: currentTheory,
                    query: text
                })
            });
            const data = await response.json();
            
            loader.remove();
            if (data.reply) {
                appendMessage(chatMessages, data.reply, 'ai');
            } else {
                appendMessage(chatMessages, `Error occurred.`, 'ai');
            }
        } catch (error) {
            console.error('Doubt error:', error);
            loader.remove();
            appendMessage(chatMessages, 'Error communicating with Doubt Agent.', 'ai');
        }
    }

    // 4. Code Evaluation (Evaluate Agent)
    submitCodeBtn.addEventListener('click', async () => {
        const sol = codeEditor.value.trim();
        if (!sol) {
            alert('Please write some code before submitting.');
            return;
        }

        const query = codeQuery.value.trim();
        const loaderMsg = query ? `Submitting code with query: "${query}"...` : "Evaluating your code submission...";
        const loader = appendMessage(chatMessages, loaderMsg, 'user');
        
        submitCodeBtn.disabled = true;

        try {
            const response = await fetch(`${API_BASE_URL}/evaluate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    problem_statement: currentProblemStatement,
                    is_dsa: true, // Assuming true for now
                    user_solution: sol,
                    user_query: query
                })
            });
            const data = await response.json();
            loader.remove();
            
            if(data.tutor_reply) {
                appendMessage(chatMessages, `**Evaluation Results:**\n\n${data.tutor_reply}`, 'ai');
                
                if (data.backend_db_payload && data.backend_db_payload.has_errors === false) {
                    appendMessage(chatMessages, "✅ Correct solution! You can click **Start Next Subtopic** to move forward.", 'ai');
                } else {
                    appendMessage(chatMessages, "❌ Incorrect solution. Check the feedback and try again, or you can skip using the **Start Next Subtopic** button.", 'ai');
                }
            } else {
                appendMessage(chatMessages, 'No feedback received from evaluator.', 'ai');
            }
        } catch (error) {
            console.error('Eval error:', error);
            loader.remove();
            appendMessage(chatMessages, 'Error communicating with Evaluator.', 'ai');
        } finally {
            submitCodeBtn.disabled = false;
        }
    });

    // Helper: append chat message
    function appendMessage(container, text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender === 'ai' ? 'system-message' : 'user-message'}`;
        
        const avatar = document.createElement('div');
        avatar.className = sender === 'ai' ? 'avatar ai-avatar' : 'avatar user-chat-avatar';
        avatar.innerText = sender === 'ai' ? '🤖' : 'U';

        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.innerHTML = marked.parse(text); // parse markdown

        msgDiv.appendChild(avatar);
        msgDiv.appendChild(bubble);

        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
        
        return msgDiv;
    }
});
