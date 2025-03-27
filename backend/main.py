from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demonstration
users = {}
tasks = {}
task_counter = 1

class User(BaseModel):
    email: str
    password: str

class Task(BaseModel):
    id:int | None = None
    text: str

@app.post("/register")
def register(user: User):
    if user.email in users:
        raise HTTPException(status_code=400, detail="User already exists")
    users[user.email] = user.password
    return {"msg": "Registered successfully"}

users = {}  # in-memory for testing

@app.post("/login")
def login(user: User):
    print("Users dict:", users)
    print("Incoming email:", user.email)
    print("Incoming password:", user.password)
    if user.email not in users:
        raise HTTPException(status_code=400, detail="User not found")
    if users[user.email] != user.password:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"msg": "Logged in successfully"}


@app.get("/tasks",)
def get_tasks():
    return list(tasks.values())

@app.post("/tasks")
def create_task(task: Task):
    global task_counter
    task.id = task_counter
    task_counter += 1
    tasks[task.id] = task
    return task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    del tasks[task_id]
    return {"msg": "Task deleted"}

@app.put("/tasks/{task_id}")
def update_task(task_id: int, updated_task: Task):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    # Update the text
    tasks[task_id].text = updated_task.text
    return tasks[task_id]
