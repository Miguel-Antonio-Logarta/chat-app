import models
import schemas
from sqlalchemy.orm import Session
from sqlalchemy import and_
from fastapi import WebSocket
from connection_manager import ConnectionManager
from errors import WebSocketEventException

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

async def create_group_chat(websocket: WebSocket, new_room: schemas.CreateRoom, user: models.User, db: Session, manager: ConnectionManager):
    """Creates a group chat with user as the participant"""
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
        "type": "CREATE_GROUP_CHAT",
        "payload": {
            "room_id": db_room.id,
            "is_group_chat": db_room.is_group_chat,
            "name": db_room.name,
            "participants": [{"id": user.id, "username": user.username}]
        }
    })

async def confirm_join_group_chat(websocket: WebSocket, room: schemas.Room, user: models.User, db: Session, manager: ConnectionManager):
    """Joins a group chat with an id"""
    # Find room and check if it exists and if it is a group chat
    db_room = db.query(models.Room).filter(models.Room.id == room.room_id, models.Room.is_group_chat == True).first()
    if db_room is None or db_room.is_group_chat is False:
        raise WebSocketEventException("CONFIRM_JOIN_GROUP_CHAT", "Group chat does not exist", {
                "room_id": room.room_id
        })
    
    participant_already_exists = db.query(models.Participant).filter(models.Participant.room_id == room.room_id).first()
    if participant_already_exists:
        raise WebSocketEventException("CONFIRM_JOIN_GROUP_CHAT", f"You are already a member of {db_room.name}", {
            "room_id": room.room_id,
            "room_name" : room.name
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

async def leave_group_chat(websocket: WebSocket, room: schemas.Room, user: models.User, db: Session, manager: ConnectionManager):
    """Leaves a room"""
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
        raise WebSocketEventException("LEAVE_GROUP_CHAT", "User is not in group chat", {"room_id": room.room_id})
    
    # Check if room is a group chat, because you can only leave a room if it is a group chat
    db_room = db.query(models.Room).filter(models.Room.id == room.room_id).first()
    if not db_room.is_group_chat:
        raise WebSocketEventException("LEAVE_GROUP_CHAT", "Can't leave a room that is not a group chat", {"room_id": room.room_id})

    # Delete participant on success
    db_participant_query.delete(synchronize_session=False)
    db.commit()

    await manager.send_personal_message(websocket, {
        "type": "LEAVE_GROUP_CHAT",
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

async def invite_friend_to_group_chat(websocket: WebSocket, invite: schemas.InviteToGroupChat, user: models.User, db: Session, manager: ConnectionManager):
    """Invites a friend to a room. User must belong to the room to invite friend"""
    # Check if user belongs to a room
    belongs_to_room = db.query(models.Participant).filter(models.Participant.user_id == user.id, models.Participant.room_id == invite.room_id).first()
    if belongs_to_room is None:
        raise WebSocketEventException("INVITE_TO_GROUP_CHAT", "You are not a member of this group chat", {
            "friend_id": invite.friend_id, 
            "room_id": invite.room_id
            })

    # Check if room is a group chat
    room = db.query(models.Room).filter(models.Room.id == invite.room_id).first()
    if room.is_group_chat == False:
        raise WebSocketEventException("INVITE_TO_GROUP_CHAT", "You cannot invite a member into this chat", {
            "friend_id": invite.friend_id, 
            "room_id": invite.room_id
            })

    # Check if friend exists
    friend = db.query(models.Friend).filter((models.Friend.user_id == user.id) | (models.Friend.friend_id == user.id)).first()
    if friend is None:
        raise WebSocketEventException("INVITE_TO_GROUP_CHAT", "You are not friends", {
            "friend_id": invite.friend_id, 
            "room_id": invite.room_id
            })

    # Check if they are part of the group chat
    is_participant = db.query(models.Participant).filter(models.Participant.user_id == invite.friend_id, models.Participant.room_id == invite.room_id).first()
    if is_participant is not None:
        raise WebSocketEventException("INVITE_TO_GROUP_CHAT", "This user is already a member of this group chat", {
            "friend_id": invite.friend_id, 
            "room_id": invite.room_id
            })

    # Add friend to group chat
    new_member = models.Participant(user_id=invite.friend_id, room_id=invite.room_id)
    db.add(new_member)
    db.commit()
    db.refresh(new_member)

    await manager.send_personal_message({
        "type": "INVITE_TO_GROUP_CHAT",
        "payload": {
            "message": "Successfully added friend to group chat",
            "friend_id": new_member.user_id,
            "room_id": new_member.room_id
        }
    })

    await manager.send_message_to([new_member.user_id], {
        "type": "INVITED_TO_GROUP_CHAT",
        "payload": {
            "message": f"You were invited to {room.name}",
            "room_id": room.id,
            "name": room.name,
            "is_group_chat": room.is_group_chat,
            "created_on": room.created_on.isoformat()
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


async def join_group_chat(websocket: WebSocket, room: schemas.Room, user: models.User, db: Session, manager: ConnectionManager):
    """Previews room name, ID, and number of members for user before joining"""
    current_room = db.query(models.Room).filter(models.Room.id == room.room_id).first()
    if current_room is None or current_room.is_group_chat is False:
        raise WebSocketEventException("JOIN_GROUP_CHAT", "Sorry, this group chat does not exist", {"room_id": room.room_id})
    
    participant_already_exists = db.query(models.Participant).filter(models.Participant.room_id == current_room.id).first()
    if participant_already_exists:
        raise WebSocketEventException("JOIN_GROUP_CHAT", f"You are already a member of {current_room.name}", {
            "room_id": current_room.id,
            "room_name" : current_room.name
        })
    
    all_members = db.query(models.Participant).filter(models.Participant.room_id == room.room_id).count()

    await manager.send_personal_message(websocket, {
        "type": "JOIN_GROUP_CHAT",
        "payload": {
            "room_id": current_room.id,
            "room_name": current_room.name,
            "is_group_chat": current_room.is_group_chat,
            "member_count": all_members
        }
    })