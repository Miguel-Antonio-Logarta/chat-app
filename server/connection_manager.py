from fastapi import WebSocket
from sqlalchemy.orm import Session
import models

class ConnectedUser:
    def __init__(self, websocket: WebSocket, room: int | None = None):
        # Contains room id and websocket
        self.websocket = websocket
        self.room = room

class ConnectionManager:
    def __init__(self):
        # Active connections dict has items that are of {user_id: websocket_instance}
        self.active_connections: dict[int, WebSocket] = {}
    
    async def connect(self, websocket: WebSocket, user: models.User, db: Session):
        # Add ability to handle multiple websockets from same client. Example: user opens the client with two tabs logged in as the same user.
        self.active_connections[user.id] = websocket
        exists = db.query(models.OnlineUser).filter(models.OnlineUser.user_id == user.id).first()
        if exists is None:
            db_online_user = models.OnlineUser(user_id=user.id)
            db.add(db_online_user)
            db.commit()
        else:
            print("User is already connected")

    def disconnect(self, user: models.User, db: Session):
        # What happens if the client is using multiple websockets (e.g. multiple tabs) with the same token (same username) that all disconnect?
        # What results is that the disconnect will remove the first websocket from active connections, next it will attempt to remove the second websocket from active connections
        # But it will not be able to find it, online_user will return None and the db will not be able to delete it.

        # Remove user from onlineusers table
        self.active_connections.pop(user.id, None)
        online_user = db.query(models.OnlineUser).filter(models.OnlineUser.user_id == user.id).first()
        db.delete(online_user)
        db.commit()

    async def send_personal_message(self, websocket: WebSocket, message: dict):
        """Sends a message to the sender"""
        await  websocket.send_json(message)
    
    # Need to add ability to handle rooms
    async def emit(self, message: dict, room_id: int, db: Session):
        """Messages all online users that belong to a specified room including the sender"""
        online_participants = db.query(models.OnlineUser) \
            .filter(models.Participant.room_id == room_id,
                    models.OnlineUser.user_id == models.Participant.user_id
                ).all()
        # print(db_participants)
        for participant in online_participants:
            print(participant.user_id)
            try:
                await self.active_connections[participant.user_id].send_json(message)
            except KeyError as ke:
                print('KeyError: ', ke)

    async def broadcast(self, user: models.User, message: dict, room_id: int, db: Session):
        """Messages all online users that belong to specified room except for the sender"""
        online_participants = db.query(models.OnlineUser) \
            .filter(models.Participant.room_id == room_id, 
                    models.Participant.user_id != user.id, 
                    models.OnlineUser.user_id == models.Participant.user_id
                ).all()
        for user_id in online_participants:
            print(user_id)
            try:
                await self.active_connections[user_id].send_json(message)
            except KeyError as ke:
                print('KeyError: ', ke)

    async def send_message_to(self, users: list[int], message: dict):
        """Messages all users with specified user ids"""
        for user_id in users:
            print(user_id)
            try:
                await self.active_connections[user_id].send_json(message)
            except KeyError as ke:
                print('KeyError: ', ke)
