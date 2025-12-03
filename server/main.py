import os
import shutil   #to save audio file
import json
import time
import datetime 
from typing import List, Optional
from fastapi import FastAPI,UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware   # to interact with frontend
from pydantic import BaseModel   #validate data in api
import google.generativeai as genai
import sqlite3

#configure a setup
GOOGLE_API_KEY="AIzaSyDZrgWRSoiC99xg5Lpmv0Mu8S9ma5i8scc"
genai.configure(api_key=GOOGLE_API_KEY)    #to call genai are authorised

app = FastAPI()   #refer to app later to define our URLs

# Add CORS middleware to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

DB_NAME = "interview_coach.db"

def init_db():
    conn =sqlite3.connect(DB_NAME)
    cursor=conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS interviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            question TEXT,
            transcription TEXT,
            feedback TEXT,
            confidence_score REAL,
            clarity_score REAL
        )
    ''')

    conn.commit()
    conn.close()

init_db()


# Data models 
class ConfidenceScore(BaseModel):
    score:float
    hesitationWords:int
    hesitationDetails:List[str]
    clarity:float

class StarAnalysis(BaseModel):
    situation: str
    task: str
    action: str
    result: str

class AIResponse(BaseModel):
    transcription: str
    critique: str
    starAnalysis: StarAnalysis
    confidenceScore: ConfidenceScore
    strengths: List[str]
    improvements: List[str]
    overallRating: float
    timestamp: str



#Ai logic
def analyze_audio_with_gemini(audio_path: str, question: str):
    """
    Sends audio to Gemini 1.5 Flash for analysis.
    """
    try:
        # Upload the audio file to Google's servers temporarily
        video_file = genai.upload_file(path=audio_path)
        
        # Wait for processing (usually instant for audio)
        import time
        while video_file.state.name == "PROCESSING":
            time.sleep(1)
            video_file = genai.get_file(video_file.name)

        if video_file.state.name == "FAILED":
            raise ValueError("Audio processing failed")

        # The System Prompt
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        
        prompt = f"""
        You are an expert HR Interview Coach. The user has answered the interview question: "{question}".
        
        Task:
        1. Transcribe the audio verbatim.
        2. Analyze the answer using the STAR method (Situation, Task, Action, Result).
        3. Identify hesitation words (um, uh, like) and count them.
        4. Provide constructive feedback.
        
        Output strictly valid JSON with this structure:
        {{
            "transcription": "text...",
            "critique": "general feedback paragraph...",
            "starAnalysis": {{
                "situation": "...",
                "task": "...",
                "action": "...",
                "result": "..."
            }},
            "confidenceScore": {{
                "score": 8.5, 
                "hesitationWords": 3,
                "hesitationDetails": ["um", "like"],
                "clarity": 9.0
            }},
            "strengths": ["point 1", "point 2"],
            "improvements": ["point 1", "point 2"],
            "overallRating": 8.5
        }}
        """

        # Generate content
        response = model.generate_content([video_file, prompt], generation_config={"response_mime_type": "application/json"})
        
        # Clean up the JSON string
        json_str = response.text
        return json.loads(json_str)

    except Exception as e:
        print(f"AI Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
        




@app.get("/")
def read_root():
    return {"status": "Backend is running", "docs_url": "http://localhost:8080/docs"}

@app.options("/analyze")
async def options_analyze():
    return {}

@app.post("/analyze", response_model=AIResponse)
async def analyze_interview(
    file: UploadFile = File(...), 
    question: str = Form(...)
):
    """
    Main endpoint: Receives Audio File + Question -> Returns Analysis
    """
    # Save the uploaded file temporarily
    temp_filename = f"temp_{file.filename}"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # Call AI
        ai_result = analyze_audio_with_gemini(temp_filename, question)
        
        # Add timestamp
        current_time = datetime.datetime.now().isoformat()
        ai_result['timestamp'] = current_time

        # Save to SQLite Database
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        
        # We store the complex JSON objects as strings in the DB for simplicity
        cursor.execute('''
            INSERT INTO interviews (timestamp, question, transcription, feedback, confidence_score, clarity_score)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            current_time,
            question,
            ai_result['transcription'],
            ai_result['critique'],
            ai_result['confidenceScore']['score'],
            ai_result['confidenceScore']['clarity']
        ))
        conn.commit()
        conn.close()

        return ai_result

    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Analysis failed")
    finally:
        # Cleanup temp file
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

@app.get("/history")
def get_history():
    """Fetch past interviews from DB"""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row # Allows accessing columns by name
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM interviews ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return rows