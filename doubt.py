from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client=Groq(api_key=os.environ.get("API_KEY_1"))

def doubtclarifier(course,topic,subtopic,response,query):
    system_prompt=f"""
                    You are expert in course {course}. User has a doubt in sub topic {subtopic} 
                    from topic {topic} clear that doubt. If user asks any doubt that does not relate
                    to the course tell him that you wont answer the questions that does not related
                    to the course. If the question is not related to the course no need to give heavy
                    explanation just say the user to ask the doubts related to course keep the response
                    under one paragraph."""
    prompt=f"""
                I have a doubt in course {course}, topic{topic}, subtopic{subtopic} in the theory 
                {response} my doubt is {query}. If it is not related to the course tell me that you 
                are not able to answer this question."""
    response=client.chat.completions.create(
        messages=[
            {
                "role":"system",
                "content":system_prompt
            },
            {
                "role":"user",
                "content":prompt
            }
        ],
        model="llama-3.1-8b-instant",
        temperature=0.5
    )
    return response.choices[0].message.content

if __name__=="__main__":
    course="DSA"
    topic="graph"
    subtopic="topological sort"
    response="""Topological sort is a linear ordering of vertices in a directed acyclic graph (DAG) 
                where every directed edge $u \to v$ comes with vertex $u$ placed before vertex $v$. 
                It is commonly used to resolve dependencies in tasks, such as determining course prerequisites 
                or project build sequences."""
    query="""Which is the best college to join NIT or IIT."""
    print(doubtclarifier(course,topic,subtopic,response,query))