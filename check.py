import requests
import datetime

def check_question_by_number():
    username = input("Enter LeetCode username: ")
    question_number = input("Enter problem number (e.g., 1): ")
    
    # Step 1: Map the question number to a title slug using the public problems API
    problems_url = "https://leetcode.com/api/problems/all/"
    try:
        prob_response = requests.get(problems_url)
        prob_response.raise_for_status()
        problems_data = prob_response.json()
        
        target_slug = None
        for item in problems_data.get("stat_status_pairs", []):
            if str(item.get("stat", {}).get("frontend_question_id")) == question_number:
                target_slug = item.get("stat", {}).get("question__title_slug")
                break
                
        if not target_slug:
            print(f"Could not find a problem with number '{question_number}' on LeetCode.")
            return
            
        print(f"Mapped Question #{question_number} to slug: '{target_slug}'\n")
        
    except requests.exceptions.RequestException as error:
        print(f"Error fetching problem list: {error}")
        return

    # Step 2: Query the recent 20 submissions
    graphql_url = "https://leetcode.com/graphql"
    graphql_query = """
    query recentAcSubmissions($username: String!, $limit: Int!) {
        recentAcSubmissionList(username: $username, limit: $limit) {
            title
            titleSlug
            timestamp
        }
    }
    """
    
    variables = {
        "username": username,
        "limit": 20 
    }
    
    try:
        response = requests.post(graphql_url, json={"query": graphql_query, "variables": variables})
        response.raise_for_status()
        
        data = response.json()
        submissions = data.get("data", {}).get("recentAcSubmissionList", [])
        
        if not submissions:
            print(f"No recent accepted submissions found for user: '{username}'.")
            return
            
        # Check if the target slug is in the recent submissions
        found = False
        for submission in submissions:
            if submission.get("titleSlug") == target_slug:
                found = True
                title = submission.get("title")
                timestamp_int = int(submission.get("timestamp"))
                date_time = datetime.datetime.fromtimestamp(timestamp_int).strftime('%Y-%m-%d %H:%M:%S')
                
                print(f"Verified! '{username}' solved #{question_number} ({title})")
                print(f"Time of Accepted Submission: {date_time}")
                print("Note: Source code cannot be extracted without an authenticated session cookie.")
                break
                
        if not found:
            print(f"Not Found. Question #{question_number} is not in the last 20 accepted submissions for '{username}'.")
            
    except requests.exceptions.RequestException as error:
        print(f"Error communicating with LeetCode API: {error}")

if __name__ == "__main__":
    check_question_by_number()