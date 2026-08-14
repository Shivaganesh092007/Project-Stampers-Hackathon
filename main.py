import json
import os
from dotenv import load_dotenv
from groq import Groq
from pydantic import BaseModel, ValidationError
from typing import List

load_dotenv()

client = Groq(api_key=os.environ.get("API_KEY_1"))

class MainResult(BaseModel):
    theory: str
    problem_statement: str

def mainagent(course, present_topic, present_subtopic, problem_statement, covered_topics: List[str], covered_subtopics: List[str]):

    json_example = """{
      "theory": "Write the complete detailed explanation here as a single string.",
      "problem_statement": "Write the problem statement and complexities here as a single string."
    }"""

    system_prompt = f"""You are a senior mentor. The user is studying the course {course}.
    User completed topics {covered_topics} and is currently studying {present_topic}.
    In that topic, the user completed subtopics {covered_subtopics} and is currently studying {present_subtopic}.

    Your task: Give a detailed description about {present_subtopic}. Then, ask the user to solve the question: {problem_statement}. 
    Do NOT give the answer, code, or hints. Just explain the subtopic and let the user code.

    You must strictly return the response in this exact flat JSON format where both values are single strings:
    {json_example}
    if the problem statement is empty create a problem state related to that subtopic."""

    prompt = f"""I am a student learning the course {course}. I have completed topics {covered_topics}. 
    Right now, I am studying {present_topic} and have completed its subtopics {covered_subtopics}. 
    I am now going to study subtopic {present_subtopic}.

    Please explain this subtopic clearly. Then, give me the structured problem statement for:
    {problem_statement}
    Do not reveal any code or hints. Please include the expected time and space complexity if applicable.

    Return ONLY a valid JSON object matching the exact template requested by the system."""

    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        model="llama-3.1-8b-instant",
        response_format={
            "type": "json_object"
        },
        temperature=0.8
    )
    
    json_string = response.choices[0].message.content
    
    try:
        validated_data = MainResult.model_validate_json(json_string)
        return validated_data.model_dump()
    except ValidationError as e:
        print("Validation Error: The LLM did not return flat strings. Raw output below:")
        return json.loads(json_string)

if __name__ == "__main__":
    course = "DSA"
    present_topic = "graphs"
    covered_topics = ["Arrays", "Two pointers", "sliding window", "Binary Search", "Stack", "Queue", "Linked list", "Binary trees", "Trees"]
    present_subtopic = "topological sort"
    covered_subtopics = ["BFS", "DFS", "PRIMS", "KRUSHKAL"]
    problem_statement = """"""
    
    print(mainagent(course, present_topic, present_subtopic, problem_statement, covered_topics, covered_subtopics))