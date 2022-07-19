from requests import session
import models
import schemas
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List
import json
from fastapi import WebSocket
from connection_manager import ConnectionManager

async def pong(websocket: WebSocket, manager: ConnectionManager):
    print(f'ping recieved from {websocket}')
    await manager.send_personal_message(websocket, {
        "type": "PONG",
        "payload": {}
    })

async def send_message(websocket: WebSocket, message: schemas.SendMessage, user: models.User, db: Session, manager: ConnectionManager):
    """Sends a message to a room"""
    # Check if user belongs to the room. Finds a participant that matches the room id, and sees if the user id matches that of the user
    valid_room = db.query(models.Participant).filter(models.Participant.room_id == message.room_id, models.Participant.user_id == user.id).first()
    if valid_room is None:
        await manager.send_personal_message({
            "type": "ERORR", 
            "payload": {
                "message": "User is not a member of this room",
                "room_id": message.room_id
            }
        })

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

async def get_group_chats(websocket: WebSocket, user: models.User, db: Session, manager: ConnectionManager):
    """Gets user group chats"""
    query = db.query(models.Room) \
              .filter(models.Participant.user_id == user.id, 
                      models.Participant.room_id == models.Room.id, 
                      models.Room.is_group_chat == True).all()
    rooms_out = []
    for room in query:
        # In the future also add "latest_message"
        rooms_out.append({
            "room_id": room.id,
            "name": room.name,
            "is_group_chat": room.is_group_chat,
            "created_on": room.created_on.isoformat()
        })

    await manager.send_personal_message(websocket, {
        "type": "GET_GROUP_CHATS",
        "payload": rooms_out
    })

async def get_friend_dms():
    """Gets Friend DMs"""

async def get_rooms(websocket: WebSocket, user: models.User, db: Session, manager: ConnectionManager):
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

async def create_room(websocket: WebSocket, new_room: schemas.CreateRoom, user: models.User, db: Session, manager: ConnectionManager):
    """Creates a room with user as the participant"""
    # Create a room
    db_room = models.Room(**new_room.dict(), is_group_chat=True)
    db.add(db_room)
    db.commit()
    db.refresh(db_room)

    # Put user id and room id in participant
    db_participant = models.Participant(user_id=user.id, room_id=db_room.id)

    # Create a participant
    db.add(db_participant)
    db.commit()
    db.refresh(db_participant)

    # Send back group chat
    await manager.send_personal_message(websocket, {
        "type": "CREATE_ROOM",
        "payload": {
            "room_id": db_room.id,
            "is_group_chat": db_room.is_group_chat,
            "name": db_room.name,
            "participants": [{"id": user.id, "username": user.username}]
        }
    })

async def join_room(websocket: WebSocket, room: schemas.Room, user: models.User, db: Session, manager: ConnectionManager):
    """Joins a room with an id"""
    # Find room and check if it exists and if it is a group chat
    db_room = db.query(models.Room).filter(models.Room.id == room.room_id, models.Room.is_group_chat == True).first()
    if db_room is None:
        await manager.send_personal_message(websocket, {
            "type": "ERORR", 
            "payload": {
                "message": "Group chat does not exist",
                "room_id": room.room_id
            }
        })
    
    # Add participant with room_id and user_id
    db_participant = models.Participant(user_id=user.id, room_id=db_room.id)
    db.add(db_participant)
    db.commit()
    db.refresh(db_participant)

    # Send back message that user has successfully joined
    await manager.send_personal_message(websocket, {
        "type": "JOIN_ROOM",
        "payload": {
            "message": f"Successfully joined {db_room.name}",
            # "room_name": db_room.name,
            "room_id": db_room.id,
            "name": db_room.name,
            "is_group_chat": db_room.is_group_chat,
            "created_on": db_room.created_on.isoformat()
        }
    })

    # Message room participants that user has joined the group chat
    await manager.broadcast(websocket, {
        "type": "PARTICIPANT_JOINED",
        "payload": {
            "user_id": user.id,
            "username": user.username,
            "room_id": db_room.id,
            "timestamp": db_participant.created_on.isoformat()
        }
    }, room.room_id, db)

async def leave_room(websocket: WebSocket, room: schemas.Room, user: models.User, db: Session, manager: ConnectionManager):
    """Leaves a room"""
    print("Leaving a room")
    # def leave_room(...):
    #   Check if user belongs to room
    #   Check if it is a group chat. Because you can only leave a room if it is a group chat
    #   Leave room
    #   Broadcast to user that user have left the room successfully
    #   Broadcast to the room that user has left the room

    # Check if user belongs to room
    db_participant_query = db.query(models.Participant).filter(models.Participant.room_id == room.room_id, models.Participant.user_id == user.id)
    db_participant = db_participant_query.first()
    if db_participant is None:
        await manager.send_personal_message(websocket, {
            "type": "ERORR", 
            "payload": {
                "message": "User is not in group chat",
                "room_id": room.room_id
            }
        })
        return
    
    # Check if room is a group chat, because you can only leave a room if it is a group chat
    db_room = db.query(models.Room).filter(models.Room.id == room.room_id).first()
    if not db_room.is_group_chat:
        await manager.send_personal_message(websocket, {
            "type": "ERORR", 
            "payload": {
                "message": "Can't leave a room that is not a group chat",
                "room_id": room.room_id
            }
        })
        return

    # Delete participant on success
    db_participant_query.delete(synchronize_session=False)
    db.commit()

    await manager.send_personal_message(websocket, {
        "type": "LEAVE_ROOM",
        "payload": {
            "message": "Successfully left room",
            "room_id": room.room_id
        }
    })

    await manager.broadcast(websocket, {
        "type": "PARTICIPANT_LEFT",
        "payload": {
            "user_id": user.id,
            "username": user.username,
            "room_id": room.room_id
        }
    }, room.room_id, db)

async def send_friend_request():
    """Sends a friend request"""
    pass

async def accept_friend_request():
    """Accepts a friend request"""
    pass

async def reject_friend_request():
    """Rejects a friend request"""

async def invite_friend():
    """Invites a friend to a room. User must belong to the room to invite friend"""
    pass

async def get_messages(websocket: WebSocket, room: schemas.Room, user: models.User, db: Session, manager: ConnectionManager):
    """Gets all messages from a room"""
    db_room = db.query(models.Room).filter(models.Room.id == room.room_id).first()
    if db_room is None:
        # Send an error back
        pass

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
            "room_name": db_room.name,
            "room_id": room.room_id,
            "messages": messages_out
        }
    })

async def get_room_info(websocket: WebSocket, room: schemas.Room, user: models.User, db: Session, manager: ConnectionManager):
    """Gets room's id, name, users, etc..."""
    current_room = db.query(models.Room).filter(models.Room.id == room.room_id).first()
    
    # Get all online and offline users
    all_users = db.query(models.Participant, models.User, models.OnlineUser) \
                  .join(models.User, models.Participant.user_id == models.User.id, isouter=True) \
                  .join(models.OnlineUser, models.Participant.user_id == models.OnlineUser.user_id, isouter=True) \
                  .filter(models.Participant.room_id == room.room_id).all()

    online_users = []
    offline_users = []
    for db_participant, db_user, db_online_user in all_users:
        # if db_participant is None and db_user is None:
        #     print("Participant and User is None!")
        if db_participant is not None and db_online_user is not None:
            online_users.append({
                "user_id": db_participant.user_id,
                "username": db_user.username
            })
        elif db_participant is not None and db_online_user is None:
            offline_users.append({
                "user_id": db_participant.user_id,
                "username": db_user.username
            })

    await manager.send_personal_message(websocket, {
        "type": "GET_ROOM_INFO",
        "payload": {
            "room_id": current_room.id,
            "room_name": current_room.name,
            "is_group_chat": current_room.is_group_chat,
            "online_users": online_users,
            "offline_users": offline_users
        }
    })


async def get_group_chat_info(websocket: WebSocket, room: schemas.Room, user: models.User, db: Session, manager: ConnectionManager):
    """Gets room name, ID, and number of members"""
    current_room = db.query(models.Room).filter(models.Room.id == room.room_id).first()
    
    if current_room is None:
        await manager.send_personal_message(websocket, {
            "type": "GET_GROUP_CHAT_INFO",
            "payload": {
                "message": "Sorry, this group chat does not exist",
                "room_id": room.room_id,
                "exists": False
            }
        })
        return

    all_members = db.query(models.Participant).filter(models.Participant.room_id == room.room_id).count()

    await manager.send_personal_message(websocket, {
        "type": "GET_GROUP_CHAT_INFO",
        "payload": {
            "room_id": current_room.id,
            "room_name": current_room.name,
            "is_group_chat": current_room.is_group_chat,
            "member_count": all_members,
            "exists": True
        }
    })
# Get all rooms
# Create Room DONE
# Leave Room DONE
# Add friend
# Accept / Room Invite
# Accept / friend request
# Remove friend
# Invite friend
# Send message
# Is typing
# Mark message as read
