from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, chat

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
