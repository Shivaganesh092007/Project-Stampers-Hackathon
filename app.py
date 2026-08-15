from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from main import mainagent
from solution_verifer import verify_solution
from doubt import doubtclarifier
from course import generate_course_plan

app = FastAPI(title="AI Agentic Learning Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CourseRequest(BaseModel):
    course_name: str

class MainAgentRequest(BaseModel):
    course: str
    present_topic: str
    present_subtopic: str
    problem_statement: str = ""
    covered_topics: List[str] = []
    covered_subtopics: List[str] = []

class EvaluateRequest(BaseModel):
    problem_statement: str
    is_dsa: bool = True
    user_solution: str
    user_query: str = ""

class DoubtRequest(BaseModel):
    course: str
    topic: str
    subtopic: str
    theoryResponse: str
    query: str

@app.post("/agent/course")
def course_endpoint(req: CourseRequest):
    try:
        plan = generate_course_plan(req.course_name)
        return {"course_plan": plan}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/agent/main")
def main_agent_endpoint(req: MainAgentRequest):
    try:
        result = mainagent(
            req.course, 
            req.present_topic, 
            req.present_subtopic, 
            req.problem_statement, 
            req.covered_topics, 
            req.covered_subtopics
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/agent/evaluate")
def evaluate_endpoint(req: EvaluateRequest):
    try:
        result = verify_solution(
            req.problem_statement, 
            req.is_dsa, 
            req.user_solution, 
            req.user_query
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/agent/doubt")
def doubt_endpoint(req: DoubtRequest):
    try:
        reply = doubtclarifier(
            req.course, 
            req.topic, 
            req.subtopic, 
            req.theoryResponse, 
            req.query
        )
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=5000, reload=True)
