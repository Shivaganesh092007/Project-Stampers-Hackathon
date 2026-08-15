# AI Education Platform (Project Stampers)

An intelligent, AI-powered education platform designed to provide a highly personalized learning pathway for students. The platform leverages advanced LLMs (via Groq API) to generate dynamic coursework, strictly verify coding solutions, and predict the optimal next topics based on a student's individual learning history and misconceptions.

## Architecture

The project consists of three main components:

1. **Frontend**: A modern, responsive React/Vite application that provides the user interface for students to learn topics, write code, and chat with the AI tutor. Located in the `Frontend/` directory.
2. **Backend**: A Node.js and Express backend that handles user authentication, database connections, and serves as the intermediary between the frontend and the AI microservices. Located in the `JS Backend/` directory.
3. **AI Agents (Python)**: A collection of specialized Python scripts powered by the Groq API (Llama 3.1) that act as different "agents" in the system:
   - `main.py`: Generates theory, explanations, and problem statements for a given topic.
   - `solution_verifer.py`: Acts as a strict code reviewer. It performs logical verification of user solutions, highlights specific mistakes, and provides detailed intuition for the correct approach.
   - `predictor.py`: An AI learning path advisor that analyzes user history, completed topics, and recent mistakes to recommend the optimal next learning step.
   - `doubt.py`, `summary.py`, `course.py`, etc.: Handle answering student doubts, summarizing content, and managing course structures.

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- Python 3.8+
- [Groq API Key](https://console.groq.com/) for running the AI agents.

### 1. Frontend Setup
Navigate to the `Frontend` directory, install dependencies, and start the development server:
```bash
cd Frontend
npm install
npm run dev
```

### 2. Backend Setup
Navigate to the `JS Backend` directory, configure your environment variables, install dependencies, and start the backend server:
```bash
cd "JS Backend"
npm install
# Ensure you create a .env file with appropriate DB and configuration variables
npm start
```

### 3. AI Agents Setup
The Python scripts require a Groq API key to function.
1. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
2. Install the required Python packages:
   ```bash
   pip install groq pydantic python-dotenv
   ```
3. Set up your `.env` file in the root directory with the necessary API keys:
   ```env
   API_KEY_1=your_groq_api_key_here
   SV_API_KEY=your_groq_api_key_here
   P_API_KEY=your_groq_api_key_here
   ```
4. Run individual agents to test:
   ```bash
   python main.py
   python solution_verifer.py
   ```

## Features

- **Dynamic Content Generation**: Theory and problem statements are generated on-the-fly based on the student's progress.
- **Strict Solution Verification**: Goes beyond basic unit tests by using AI to logically analyze code, pinpoint exact flaws, and explain intuition.
- **Adaptive Learning Path**: Recommends the next best topic based on the student's specific misconceptions, ensuring foundational gaps are addressed before moving forward.
- **Threaded Agent Chat**: Seamless conversational interface for students to clarify doubts and get hints.
