"""
Messaging.py
Contains functions that handle events regarding messages:
* send_message: Emits a message from a user to other online users
* get_messages: Sends messages from a room to a user
"""
import models
import schemas
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List
from fastapi import WebSocket
from connection_manager import ConnectionManager
from errors import WebSocketEventException

async def send_message(websocket: WebSocket, message: schemas.SendMessage, user: models.User, db: Session, manager: ConnectionManager):
    """Sends a message to a room"""
    # Check if user belongs to the room. Finds a participant that matches the room id, and sees if the user id matches that of the user
    valid_room = db.query(models.Participant) \
                        .filter(models.Participant.room_id == message.room_id, 
                                models.Participant.user_id == user.id) \
                        .first()
    if valid_room is None:
        raise WebSocketEventException(
                event_name="SEND_MESSAGE", 
                message="User is not a member of this room", 
                other={"room_id": message.room_id}
            )
        

    # Store message in database
    db_message = models.Message(**message.dict(), user_id=user.id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)

    # Send everyone in the room the new message
    await manager.emit({
            "type": "SEND_MESSAGE",
            "payload": {
                "id": db_message.id,
                "username": user.username,
                "message": db_message.message,
                "timestamp": db_message.created_on.isoformat()
            }
        }, message.room_id, db)

async def get_messages(websocket: WebSocket, room: schemas.Room, user: models.User, db: Session, manager: ConnectionManager):
    """Gets all messages from a room"""
    # Check if user is a member of the room
    is_member = db.query(models.Room, models.Participant) \
                    .filter(models.Participant.room_id == models.Room.id,
                            models.Participant.user_id == user.id,
                            models.Participant.room_id == room.room_id) \
                    .first()
    if is_member is None:
        # Send an error back
        raise WebSocketEventException(
                event_name="GET_MESSAGES", 
                message="User cannot read messages from a room they are not part of, or read messages from a room that does not exist", 
                other={"room_id": room.room_id}
            )

    (db_room, db_participant) = is_member

    # Get messages from the room
    query = db.query(models.Message, models.User)\
                .filter(models.Message.room_id == room.room_id, 
                        models.Message.user_id == models.User.id) \
                .order_by(models.Message.created_on.asc()) \
                .all()
    messages_out: List[schemas.SendMessage] = []
    for db_message, db_user in query:
        messages_out.append({
            "id": db_message.id,
            "username": db_user.username,
            "message": db_message.message,
            "timestamp": db_message.created_on.isoformat()
        })
    
    await manager.send_personal_message(websocket, {
        "type": "GET_MESSAGES",
        "payload": {
            "room_name": db_room.name,
            "room_id": room.room_id,
            "messages": messages_out
        }
    })