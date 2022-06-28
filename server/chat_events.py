import models
import schemas
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List
import json
from fastapi import WebSocket
from connection_manager import ConnectionManager

async def ws_send_message(websocket: WebSocket, message: schemas.SendMessage, user: models.User, db: Session, manager: ConnectionManager):
    """Sends a message to a room"""
    # Check if user belongs to the room. Finds a participant that matches the room id, and sees if the user id matches that of the user
    valid_room = db.query(models.Participant).filter(and_(models.Participant.room_id == message.room_id, models.Participant.user_id == user.id)).first()
    if valid_room is None:
        pass

    db_message = models.Message(**message.dict(), user_id=user.id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    # TODO: emit to a room instead of emitting to all clients
    # await manager.emit(json.dumps({
    #         "type": "SEND_MESSAGE",
    #         "payload": {
    #             "id": db_message.id,
    #             "username": user.username,
    #             "message": db_message.message,
    #             "timestamp": db_message.created_on.isoformat()
    #         }
    #     }, indent=4, sort_keys=True, default=str)
    # )
    await manager.emit({
            "type": "SEND_MESSAGE",
            "payload": {
                "id": db_message.id,
                "username": user.username,
                "message": db_message.message,
                "timestamp": db_message.created_on.isoformat()
            }
        }, message.room_id, db)

async def ws_get_rooms(websocket: WebSocket, user: models.User, db: Session, manager: ConnectionManager):
    """Gets all rooms that the user is a part of"""
    # Get all Participants that match the user id -> now we have list of room_ids
    # Get
    # SELECT * FROM Participant WHERE Participant.user_id == user.id RIGHT JOIN ROOMS WHERE Participant.room_id == ROOM.id
    # db.query(models.)
    query = db.query(models.Participant, models.Room).filter(and_(models.Participant.user_id == user.id, models.Participant.room_id == models.Room.id)).all()
    rooms_out = []
    for participant, room in query:
        # In the future also add "latest_message"
        rooms_out.append({
            "room_id": room.id,
            "name": room.name,
            "is_group_chat": room.is_group_chat,
            "created_on": room.created_on.isoformat()
        })

    await manager.send_personal_message(websocket, {
        "type": "GET_ROOMS",
        "payload": rooms_out
    })

async def ws_create_room(websocket: WebSocket, new_room: schemas.CreateRoom, user: models.User, db: Session, manager: ConnectionManager):
    """Creates a room with user as the participant"""
    # Add a check to see if the user already has a group chat that has the same name to prevent duplicates
    # Create a room
    # Create a participant
    # Put user id and room id in participant
    db_room = models.Room(**new_room.dict())
    db.add(db_room)
    db.commit()
    db.refresh(db_room)

    db_participant = models.Participant(user_id=user.id, room_id=db_room.id)
    db.add(db_participant)
    db.commit()
    db.refresh(db_participant)

    await manager.send_personal_message(websocket, {
        "type": "CREATE_ROOM",
        "payload": {
            "room_id": db_room.id,
            "is_group_chat": db_room.is_group_chat,
            "name": db_room.name,
            "participants": [{"id": user.id, "username": user.username}]
        }
    })

async def ws_join_room(websocket: WebSocket, room: schemas.JoinRoom, user: models.User, db: Session, manager: ConnectionManager):
    """Joins a room with an id"""
    # Find room and check if it exists
    db_room = db.query(models.Room).filter(models.Room.id == room.room_id).first()
    if db_room is None:
        await manager.send_personal_message(websocket, {
            "type": "ERORR", 
            "payload": {
                "message": "Room does not exist"
            }
        })
    
    # Add participant with room_id and user_id
    db_participant = models.Participant(user_id=user.id, room_id=db_room.id)
    db.add(db_participant)
    db.commit()
    db.refresh(db_room)

    await manager.send_personal_message(websocket, {
        "type": "JOIN_ROOM",
        "payload": {
            "message": f"Successfully joined {db_room.name}",
            "room_name": db_room.name,
            "room_id": db_room.id
        }
    })

async def ws_leave_room(websocket: WebSocket, room: schemas.LeaveRoom, user: models.User, db: Session, manager: ConnectionManager):
    """Leaves a room"""
    # Remove participant that matches the room id
    # Add a check to see if they are the only member of the room left. If so, delete the group chat too
    # Find participant where room id and user id matches
    db_participant_query = db.query(models.Participant).filter(and_(models.Participant.room_id == room.room_id, models.Participant.user_id == user.id))
    db_participant = db_participant_query.first()

    if db_participant is None:
        await manager.send_personal_message(websocket, {
            "type": "ERORR", 
            "payload": {
                "message": "User is not in specified group chat"
            }
        })
        return
    
    db_participant_query.delete(synchronize_session=False)
    db.commit()

    # TODO: Send this message to a room instead of all the clients
    await manager.broadcast(websocket, {
        "type": "PARTICIPANT_LEFT",
        "payload": {
            "message": f"{user.username} has left the chat"
        }
    })

    await manager.send_personal_message(websocket, {
        "type": "LEAVE_ROOM",
        "payload": {
            "message": "Successfully left room"
        }
    })

async def ws_send_friend_request():
    """Sends a friend request"""
    pass

async def ws_add_friend():
    """Accepts a friend request"""
    pass

async def ws_invite_friend():
    """Invites a friend to a room. User must belong to the room to invite friend"""
    pass

async def ws_get_messages(websocket: WebSocket, room: schemas.GetMessages, user: models.User, db: Session, manager: ConnectionManager):
    """Gets all messages from a room"""
    query = db.query(models.Message, models.User).filter(and_(models.Message.room_id == room.room_id, models.Message.user_id == models.User.id)).order_by(models.Message.created_on.asc()).all()
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
            "room_id": room.room_id,
            "messages": messages_out
        }
    })

# Get all rooms
# Create Room
# Leave Room
# Add friend
# Accept / Room Invite
# Accept / friend request
# Remove friend
# Invite friend
# Send message
# Is typing
# Mark message as read
