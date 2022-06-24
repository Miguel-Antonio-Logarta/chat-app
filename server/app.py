# from random import randint
from fastapi import FastAPI, WebSocket
# from fastapi_socketio import SocketManager
from routers import users, chat
from fastapi.middleware.cors import CORSMiddleware
# import chatter


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    # allow any origin for development purposes, don't do this in production
    allow_origins=['*'], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# socket_manager = SocketManager(app=app, cors_allowed_origins=[])
app.include_router(users.router)
app.include_router(chat.router)

@app.get("/")
async def get():
    return 'hello'

# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     while True:
#         data = await websocket.receive_text()
#         print(data)
#         await websocket.send_text(f"Message text was: {data}")