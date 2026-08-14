import json
import os
from dotenv import load_dotenv
from groq import Groq

# Initialize the Groq client
load_dotenv()
client = Groq(api_key=os.environ.get("P_API_KEY"))

def recommend_next_topic(completed_topics, incomplete_topics, mistakes_misconceptions):
    """
    Analyzes user history and incomplete topics to recommend the optimal next learning step.
    Returns a JSON payload containing the explanation and the chosen topic index.
    """
    
    # Format the incomplete topics nicely for the LLM to understand its options
    incomplete_options = "\n".join([f"Index {idx}: {topic}" for idx, topic in enumerate(incomplete_topics)])
    
    system_prompt = f"""
    You are an expert AI learning path advisor. Your goal is to construct a continuously adapting learning pathway for a student based on their performance and knowledge gaps.

    STUDENT PROFILE:
    - Completed Topics: {', '.join(completed_topics) if completed_topics else 'None'}
    - Recent Mistakes & Misconceptions: 
      {chr(10).join(['- ' + m for m in mistakes_misconceptions]) if mistakes_misconceptions else 'None'}

    AVAILABLE NEXT TOPICS (INCOMPLETE):
    {incomplete_options}

    YOUR DIRECTIVES:
    1. Analyze the 'Recent Mistakes & Misconceptions' to identify fundamental gaps in the student's understanding.
    2. Review the 'AVAILABLE NEXT TOPICS'. Select the ONE topic that best addresses their current weaknesses. 
       - If their mistakes show a lack of prerequisite knowledge, pick the most fundamental topic available.
       - If they have no mistakes, pick the logical next progression.
    3. Formulate a highly personalized, empathetic, and encouraging message to the user (`suggestion_explanation`). Explain *why* you are recommending this specific topic based on their past mistakes.
    4. Extract the exact integer Index of the topic you chose (`suggested_topic_index`).

    CRITICAL RESTRICTION: You MUST respond in pure JSON format matching this exact schema:
    {{
        "suggested_topic_index": <integer index of the chosen topic>,
        "suggestion_explanation": "Your personalized, encouraging message to the user explaining the 'why' behind this recommendation."
    }}
    """

    try:
        user_prompt = "Analyze my profile and recommend my next topic. Return only the requested JSON."
        
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama-3.1-8b-instant", # Or llama3-70b-8192 for even deeper reasoning
            temperature=0.3, # Low temperature for logical consistency
            max_tokens=1024,
            response_format={"type": "json_object"}
        )
        
        response_content = chat_completion.choices[0].message.content
        return json.loads(response_content)
        
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

# --- Testing the Flow with Simulated Database Records ---
if __name__ == "__main__":
    
    # 1. Simulated DB Data
    db_completed_topics = ["Basic Arrays", "For Loops", "If/Else Statements"]
    
    # We store the incomplete topics in an ordered list. The index here is what the backend needs.
    db_incomplete_topics = [
        "Dynamic Programming",       # Index 0
        "Hash Maps & Dictionaries",  # Index 1
        "Graph Traversal (BFS/DFS)", # Index 2
        "Two Pointers Technique"     # Index 3
    ]
    
    # Simulated mistakes gathered from the Solution Verifier agent over time
    db_mistakes_misconceptions = [
        "Used nested O(n^2) loops instead of an O(n) lookup.",
        "Failed to keep track of previously seen elements efficiently.",
        "Struggled with the concept of mapping a complement value to its original index.",
        "Attempted to use an array to store key-value pairs, leading to messy code."
    ]
    
    print("### ANALYZING STUDENT PROFILE... ###\n")
    
    # 2. Run the Agent
    recommendation_result = recommend_next_topic(
        completed_topics=db_completed_topics,
        incomplete_topics=db_incomplete_topics,
        mistakes_misconceptions=db_mistakes_misconceptions
    )
    
    # 3. Handle and Route Output
    if "error" in recommendation_result:
        print(f"FAILED: {recommendation_result['error']}")
    else:
        chosen_index = recommendation_result.get("suggested_topic_index")
        explanation = recommendation_result.get("suggestion_explanation")
        
        print("--- MESSAGE TO DISPLAY TO USER ---")
        print(explanation)
        print("\n" + "="*50 + "\n")
        
        print("--- DATA TO SEND TO BACKEND DB ---")
        print(f"Topic to remove/start (Index): {chosen_index}")
        print(f"Topic Name: {db_incomplete_topics[chosen_index]}")