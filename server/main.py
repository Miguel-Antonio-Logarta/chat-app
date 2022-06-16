from fastapi import FastAPI
from fastapi_socketio import SocketManager

app = FastAPI()
socket_manager = SocketManager(app=app)

# html = ""
# with open('index.html', 'r') as f:
#     html = f.read()

@app.get("/")
async def get():
    return 'hello'

@app.sio.on('client_connect_event')
async def handle_client_connect_event(sid, *args, **kwargs):
	await app.sio.emit('server_antwort01', {'data': 'connection was successful'})    

@app.sio.on('client_start_event')
async def handle_client_start_event(sid, *args, **kwargs):
	print('Server says: start_event worked')
	await app.sio.emit('server_antwort01',{'data':'start event worked'})