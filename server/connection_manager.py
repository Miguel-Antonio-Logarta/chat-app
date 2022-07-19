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
