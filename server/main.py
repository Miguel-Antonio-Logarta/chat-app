from random import randint
from fastapi import FastAPI
from fastapi_socketio import SocketManager
from routers import users
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(users.router)
app.add_middleware(
    CORSMiddleware,
    # allow any origin for development purposes, don't do this in production
    allow_origins=['*'], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
socket_manager = SocketManager(app=app, cors_allowed_origins=[])

@app.get("/")
async def get():
    return 'hello'

@app.sio.on('client_connect_event')
async def handle_client_connect_event(sid, *args, **kwargs):
	await app.sio.emit('server_test', {'data': 'connection was successful'})    

@app.sio.on('client_start_event')
async def handle_client_start_event(sid, *args, **kwargs):
	print('Server says: start_event worked')
	await app.sio.emit('server_test',{'data':'start event worked'})

# @app.sio.on()

@app.sio.on('client_message_event')
async def handle_client_message_event(sid, data):
	print("Boi just sent a message")
	print(sid)
	print(data["message"])
	messageDict = {
		"id": randint(0, 10000),
		"timestamp": "1:23",
		"message": data["message"],
		"username": sid
	}
	await app.sio.emit("sent_message", messageDict)
