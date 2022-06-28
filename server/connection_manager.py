from fastapi import WebSocket
from typing import List
import json
from sqlalchemy import and_
from sqlalchemy.orm import Session
import models
# Three ways to store connected users
# Hash table with rooms as keys
    # {1:{user1, user2, user3...}, 4:{user5,user8, user4},...}} O(1) room lookup time and we can iterate over keys. 
    # Only issue is removing websocket from a connection since we might not know where the websocket connection is
# Set of ConnectedUser(s)...
    # Instant websocket lookup time O(1).
    # We might have to iterate through every element in set to find connected user that belongs to a room
# Using an OnlineUsers table.  
    # This is good so that we can maintain connections upon server restart
# Combination: Use a hashtable with username as key and websocket as value. Query 'Participants' table to find users that are in a room
    # online_users = {'user1': websocket1, 'user2': websocket2....}
    # room_participants = db.query(models.Participants).filter(models.Participants.room_id == room_id).all()
    # for member in room_pariticpants:
    #   try:
    #       online_users[member.username].send_text({"type": "SEND_MESSAGE", "payload": message})
    #   except KeyError:
    #       continue
# Combination: Use an OnlineUsers table.
    # When sending message, it sends to all online users who belong to the room the sender is in
        # If a user is not currently in that room, send a notification instead.
    #
# Combination: Hash table with rooms as keys. The values are also hash tables, but with user ids as keys and websockets as values
    # {'room_id': {'user1', websocket}}
class ConnectedUser:
    def __init__(self, websocket: WebSocket, room: int | None = None):
        # Contains room id and websocket
        self.websocket = websocket
        self.room = room

class ConnectionManager:
    def __init__(self):
        # self.active_connections: List[WebSocket] = []
        # self.active_connections: List[ConnectedUser] = []
        # {user_id: websocket}
        self.active_connections: dict[int, WebSocket] = {}
    
    async def connect(self, websocket: WebSocket, user: models.User):
        # self.active_connections.append(websocket)
        # self.active_connections.append(ConnectedUser(websocket))
        self.active_connections[user.id] = websocket
        # Add user to onlineusers table

    def disconnect(self, user: models.User):
        # self.active_connections.remove(websocket)
        # self.active_connections = self.active_connections.filter(lambda user: user.websocket == websocket)
        # Remove user from onlineusers table
        self.active_connections.pop(user.id, None)

    async def send_personal_message(self, websocket: WebSocket, message: dict):
        # if isinstance(message) is dict:
        #     await websocket.send_json(message)
        # elif isinstance(message) is str:
        #     await websocket.send_text(message)
        await  websocket.send_json(message)
    
    # Need to add ability to handle rooms
    async def emit(self, message: dict, room_id: int, db: Session):
        # for connection in self.active_connections:
        #     if connection.room == room:
        #         await connection.websocket.send_text(message)
            # await connection.send_text(message)
        db_participants = db.query(models.Participant).filter(models.Participant.room_id == room_id).all()
        print(db_participants)
        for participant in db_participants:
            print(participant.user_id)
            try:
                await self.active_connections[participant.user_id].send_json(message)
            except KeyError as ke:
                print('KeyError: ', ke)

    async def broadcast(self, user: models.User, message: dict, room_id: int, db: Session):
        # for connection in self.active_connections:
        #     if connection is not user and connection.room == room:
        #         await connection.send_text(message)
        db_participants = db.query(models.Participant.id).filter(and_(models.Participant.room_id == room_id, models.Participant.user_id != user.id)).all()
        for user_id in db_participants:
            print(user_id)
            self.active_connections[user_id].send_json(message)
