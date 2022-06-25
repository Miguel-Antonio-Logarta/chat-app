from fastapi import WebSocket
from typing import List
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, websocket: WebSocket, message: str | dict):
        if type(message) is dict:
            await websocket.send_json(message)
        elif type(message) is str:
            await websocket.send_text(message)
        
    async def emit(self, message: dict):
        for connection in self.active_connections:
            await connection.send_text(message)

    async def broadcast(self, user: WebSocket, message: dict):
        for connection in self.active_connections:
            if connection is not user:
                await connection.send_text(message)
