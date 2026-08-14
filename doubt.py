from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client=Groq(api_key=os.environ.get("API_KEY"))

def doubtclarifier(course,topic,subtopic,response,query):
    system_prompt=f"""
                    You are expert in course {course}. User has a doubt in sub topic {subtopic} 
                    from topic {topic} clear that doubt if user asks any doubt that doesnt relate
                    to the course tell him that you wont answer """