import os
import json
from groq import Groq
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.environ.get("API_KEY_1"))

class CoursePlan(BaseModel):
    course_plan: dict[str, list[str]]

def generate_course_plan(course_name: str) -> dict[str, list[str]]:
    prompt = f"""
    Generate a detailed course plan for '{course_name}'.
    You must return ONLY valid JSON that matches the following structure exactly:
    {{
        "course_plan": {{
            "Topic 1": ["Subtopic 1.1", "Subtopic 1.2"],
            "Topic 2": ["Subtopic 2.1", "Subtopic 2.2", "Subtopic 2.3"]
        }}
    }}
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system", 
                "content": "You are an expert curriculum designer. You output strictly in JSON format."
            },
            {
                "role": "user", 
                "content": prompt
            }
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
    )

    content = response.choices[0].message.content
    
    raw_dict = json.loads(content)
    
    validated_plan = CoursePlan.model_validate(raw_dict)
    
    return validated_plan.course_plan

if __name__ == "__main__":
    test_course = "Data Strucutres and Alogorithms"
    
    print(f"Generating plan for: {test_course}...\n")
    plan_dict = generate_course_plan(test_course)
    
    for topic, subtopics in plan_dict.items():
        print(f"** {topic} **")
        for sub in subtopics:
            print(f"  - {sub}")
        print()