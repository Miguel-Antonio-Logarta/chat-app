from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from routers import users, chat
from database import get_db, db_context_manager
from sqlalchemy.orm import Session
import models
# from server.database import db_context_manager

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    # allow any origin for development purposes, don't do this in production
    allow_origins=['*'], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(chat.router)

@app.get("/")
async def get():
    return 'hello'

@app.on_event("startup")
def startup_event():
    with db_context_manager() as db:
        # We clear the online users table on startup because the shutdown event doesn't run sometimes
        db.query(models.OnlineUser).delete()
        db.commit()