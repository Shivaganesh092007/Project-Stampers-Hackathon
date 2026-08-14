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
    You are an intelligent AI tutor, an expert code reviewer, and a strict solution verifier. 

    CONTEXT:
    - Problem Statement: {problem_statement}
    - Is this a Data Structures/Algorithms (DSA) question?: {is_dsa}
    
    USER INPUT:
    - User's Solution: {user_solution}
    - User's Query: {user_query}

    YOUR DIRECTIVES:
    You must evaluate the user's solution and return a pure JSON object. You have separate tasks for the JSON keys:

    TASK 0: STRICT LOGICAL VERIFICATION (INTERNAL STEP)
    - Before deciding if the code is correct, perform a strict, line-by-line logical review.
    - Pay extreme attention to arithmetic operators (+, -, *, /), logical operators, loop bounds, and variable assignments. 
    - Do not just pattern-match. A single incorrect operator (e.g., using addition instead of subtraction) means the code is entirely INCORRECT.

    TASK 1: Formulate `tutor_reply_text` (What the user sees)
    - Based on TASK 0, assess if the user's code is strictly CORRECT or INCORRECT.
    - **IF INCORRECT (Even a small logical bug like a wrong operator)**: 
        1. Issue a polite warning about misconceptions and mistakes in a single line. 
        2. Output the exact Backend Solution: `{backend_dsa_solution}` (if Is DSA is True) or generate one (if False). Explain the solution extracted from the backend in a natural way.
        3. **CRITIQUE (SHORT)**: Provide EXACTLY ONE SINGLE LINE summarizing what they did wrong (e.g., point out the specific wrong operator or logic flaw). DO NOT over-explain.
    - **IF CORRECT**: 
        1. Give a polite appreciation and validate that their code is correct.
        2. Answer their query accurately.
        3. DO NOT invent mistakes or output the backend solution again.
    - **INTUITION (REQUIRED FOR BOTH CASES)**: Write a highly detailed, comprehensive paragraph explaining the logic, approach, and intuition behind the correct solution.

    TASK 2: Formulate `backend_db_payload` (What the database stores)
    - If INCORRECT: set "has_errors" to true. Populate `mistakes`, `misconceptions`, and `suggestions_for_improvement` arrays with multiple specific, detailed string items. You MUST explicitly list the exact logical flaw (e.g., "Used target + num instead of target - num") in the `mistakes` array.
    - If CORRECT: set "has_errors" to false, and leave the arrays EMPTY [].

    CRITICAL RESTRICTION: You MUST respond in pure JSON format matching this exact schema:
    {{
        "tutor_reply_text": "Markdown string containing: validation/warning, exact 1-line critique (if wrong), correct code block (if wrong), and a detailed paragraph explaining the approach/intuition.",
        "backend_db_payload": {{
            "has_errors": true or false,
            "mistakes": ["exact logical error 1", "mistake 2"],
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
            temperature=0.2,
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
    
    # Passing the flawed solution with the wrong operator (+)
    user_flawed_solution = """
def two_sum(nums, target):
    num_map = {}
     
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []
    """
    user_query = "Is this logic completely correct?"
    
    result = verify_solution(
        problem_statement=problem_dsa,
        is_dsa=is_dsa_flag,
        user_solution=user_flawed_solution,
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