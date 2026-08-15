import os
import json
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
client = Groq(api_key=os.environ.get("API_KEY_1"))

class StudyFeedback(BaseModel):
    summary: str
    polite_corrections: str
    suggestions: str
    praise: str

def summarize(name: str, courses_selected: List[str], topics_covered: List[str], mistakes: List[str], misconceptions: List[str]) -> dict:
    prompt = f"""
    Student Name: {name}
    Courses Enrolled: {courses_selected}
    Topics Covered: {topics_covered}
    Mistakes Made: {mistakes}
    Misconceptions: {misconceptions}
    
    Act as an encouraging and polite tutor. Review the student's learning profile and provide feedback. 
    You must return ONLY valid JSON that exactly matches this structure:
    {{
        "summary": "A brief overview of their study progress",
        "polite_corrections": "Gentle and polite corrections of their mistakes and misconceptions",
        "suggestions": "Actionable advice for improving their understanding",
        "praise": "Encouragement acknowledging their effort and what they did well"
    }}
    """
    
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": "You are a supportive educational AI. You output strictly in JSON format."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        response_format={"type": "json_object"},
        temperature=0.6,
    )
    
    content = response.choices[0].message.content
    raw_dict = json.loads(content)
    validated_feedback = StudyFeedback.model_validate(raw_dict)
    
    return validated_feedback.model_dump()

if __name__ == "__main__":
    student_name = "Alex"
    courses = ["Optimization Techniques", "Web Programming"]
    topics = ["Linear Programming", "HTML/CSS Basics", "JavaScript DOM Manipulation"]
    student_mistakes = ["Confused let and var in JavaScript", "Forgot the non-negativity constraint in LP"]
    student_misconceptions = ["Believes optimization always requires calculus"]

    feedback = summarize(
        name=student_name,
        courses_selected=courses,
        topics_covered=topics,
        mistakes=student_mistakes,
        misconceptions=student_misconceptions
    )
    
    print(json.dumps(feedback, indent=4))