import json
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
client = Groq(api_key=os.environ.get("SV_API_KEY"))

def fetch_backend_solution(problem_statement):
    return """
def two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []
"""

def verify_solution(problem_statement, is_dsa, user_solution, user_query):
    backend_dsa_solution = fetch_backend_solution(problem_statement) if is_dsa else "N/A"

    system_prompt = f"""
    You are an intelligent AI tutor and solution verifier. 

    CONTEXT:
    - Problem Statement: {problem_statement}
    - Is this a Data Structures/Algorithms (DSA) question?: {is_dsa}
    
    USER INPUT:
    - User's Solution: {user_solution}
    - User's Query: {user_query}

    YOUR DIRECTIVES:
    You must evaluate the user's solution and return a pure JSON object. You have two completely separate tasks for the JSON keys:

    TASK 1: Formulate `tutor_reply_text` (What the user sees)
    - If the user is wrong, issue a polite warning. 
    - Output the correct solution (Use the exact Backend Solution: `{backend_dsa_solution}` if Is DSA is True. Generate your own if False),explain the solution in a more natural way.
    - **INTUITION (DETAILED)**: Write a highly detailed, comprehensive paragraph explaining the logic, approach, and intuition behind the correct code.
    - **CRITIQUE (SHORT)**: Provide EXACTLY ONE SINGLE LINE summarizing what they did wrong. DO NOT explain their mistakes or improvements in detail here. Keep it to one sentence.

    TASK 2: Formulate `backend_db_payload` (What the database stores)
    - You MUST deeply analyze their specific errors behind the scenes.
    - Populate the `mistakes`, `misconceptions`, and `suggestions_for_improvement` arrays with multiple specific, detailed string items. DO NOT leave these arrays empty if there is an error.

    CRITICAL RESTRICTION: You MUST respond in pure JSON format matching this exact schema:
    {{
        "tutor_reply_text": "Markdown string containing: 1 short sentence summarizing mistakes, the correct code block, and a detailed paragraph explaining the approach/intuition.",
        "backend_db_payload": {{
            "has_errors": true or false,
            "mistakes": ["specific mistake 1", "specific mistake 2"],
            "misconceptions": ["underlying misconception 1", "underlying misconception 2"],
            "suggestions_for_improvement": ["actionable step 1", "actionable step 2"]
        }}
    }}
    """

    try:
        user_prompt = "Please verify my solution. Return only the requested JSON."
        
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama-3.1-8b-instant", 
            temperature=0.6,
            max_tokens=1024,
            response_format={"type": "json_object"}
        )
        
        response_content = chat_completion.choices[0].message.content
        parsed_response = json.loads(response_content)
        
        return {
            "tutor_reply": parsed_response.get("tutor_reply_text", "No response provided."),
            "backend_db_payload": parsed_response.get("backend_db_payload", {})
        }
        
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

if __name__ == "__main__":
    problem_dsa = "Two Sum: Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
    is_dsa_flag = True
    
    user_wrong_solution = """
def twoSum(nums, target):
    return [0, 1]
    """
    user_query = "Will this code always work for all test cases?"
    
    result = verify_solution(
        problem_statement=problem_dsa,
        is_dsa=is_dsa_flag,
        user_solution=user_wrong_solution,
        user_query=user_query
    )
    
    if "error" in result:
        print(f"FAILED: {result['error']}")
    else:
        print("### TUTOR REPLY ###\n")
        print(result.get("tutor_reply"))
        print("\n" + "="*50 + "\n")
        print("### BACKEND DB JSON PAYLOAD ###\n")
        print(json.dumps(result.get("backend_db_payload"), indent=4))