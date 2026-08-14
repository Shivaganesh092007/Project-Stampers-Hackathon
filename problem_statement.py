def generate_problem_statement(topic_type="DSA"):
    """
    Generates a problem statement for practice.
    In a real app, this might fetch from a database or use an LLM to generate one.
    """
    if topic_type == "DSA":
        problem = "Write a Python function to find the maximum contiguous subarray sum (Kadane's Algorithm)."
        is_dsa = True
    else:
        problem = "Explain the differences between classical mechanics and quantum mechanics."
        is_dsa = False
        
    return problem, is_dsa

if __name__ == "__main__":
    problem, is_dsa = generate_problem_statement("DSA")
    print(f"Generated Problem: {problem}")
    print(f"Is DSA: {is_dsa}")