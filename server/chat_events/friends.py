"""
friends.py
Contains functions that handle events regarding friends:
* send_friend_request: sends back user information about a user prior to sending a friend request
* accept_friend_request: accepts a friend request
* reject_friend_request: rejects a friend request
* confirm_send_friend_request: sends a friend request after confirmation
* get_friends: gets friends of user (Accepted friend requests)
* get_friend_requests: gets friend requests of user (Pending friend requests)
"""
import schemas
import models
from sqlalchemy.orm import Session
from fastapi import WebSocket
from connection_manager import ConnectionManager
from errors import WebSocketEventException


async def send_friend_request(websocket: WebSocket, friend: schemas.Friend, user: models.User, db: Session, manager: ConnectionManager):
    """Sends back information about a user for confirmation for a friend request"""
    db_friend = db.query(models.Friend).filter(models.Friend.user_id == user.id, models.Friend.friend_id == friend.friend_id).first()
    
    # Check if user is already friends
    if db_friend is not None and db_friend.status == models.FriendStatus.ACCEPTED:
        raise WebSocketEventException("SEND_FRIEND_REQUEST", "You are already friends", {"friend_id": friend.friend_id})
    # Check if user has already sent a friend request
    elif db_friend is not None and db_friend.status == models.FriendStatus.PENDING:
        raise WebSocketEventException("SEND_FRIEND_REQUEST", "You already sent a friend request", {"friend_id": friend.friend_id})

    # Check if user exists
    db_friend_user = db.query(models.User).filter(models.User.id == friend.friend_id).first()
    if db_friend_user is None:
        raise WebSocketEventException("SEND_FRIEND_REQUEST", "User does not exist", {"friend_id": friend.friend_id})
    
    await manager.send_personal_message(websocket, {
        "type": "SEND_FRIEND_REQUEST",
        "payload": {
            "username": db_friend_user.username,
            "user_id": db_friend_user.id
        }
    })

async def accept_friend_request(websocket: WebSocket,
                                friend: schemas.Friend,
                                user: models.User,
                                db: Session,
                                manager: ConnectionManager):
    """Accepts a friend request"""
    # Find a friend request directed towards user that matches ids. user_id (other person) -> friend_id (user)
    db_friend = db.query(models.Friend) \
                    .filter(models.Friend.user_id == friend.friend_id, 
                            models.Friend.friend_id == user.id, 
                            models.Friend.status == models.FriendStatus.PENDING) \
                    .first()
    if db_friend is None:
        raise WebSocketEventException(
                event_name="ACCEPT_FRIEND_REQUEST", 
                message="Friend request does not exist", 
                other={"friend_id": friend.friend_id}
            )

    # Create a room
    new_room = models.Room(name="", is_group_chat=False)
    db.add(new_room)
    db.commit()
    db.refresh(new_room)

    # Create two participants
    user_participant = models.Participant(room_id=new_room.id, user_id=user.id)
    friend_participant = models.Participant(room_id=new_room.id, user_id=db_friend.user_id)
    
    # Check if participants of this room already exists
    already_exists = db.query(models.Participant) \
                            .filter((models.Participant.user_id == user.id) | (models.Participant.user_id == friend.friend_id),
                                    models.Participant.room_id == new_room.id) \
                            .all()

    # Check if user participant of this room exists yet
    if not any(db_user.user_id == user.id for db_user in already_exists):
        db.add(user_participant)
        db.commit()
        db.refresh(user_participant)
    
    # Check if friend participant of this room exists yet
    if not any(db_user.user_id == friend.friend_id for db_user in already_exists):
        db.add(friend_participant)
        db.commit()
        db.refresh(friend_participant)
    
    # Finally, change friend status to accepted and provide room_id
    setattr(db_friend, 'status', models.FriendStatus.ACCEPTED)
    setattr(db_friend, 'room_id', new_room.id)
    db.commit()
    db.refresh(db_friend)

    # Sends back user information of the friend whose request we just accepted.
    db_friend_username = db.query(models.User.username).filter(models.User.id == friend.friend_id).first()
    await manager.send_personal_message(websocket, {
        "type": "ACCEPT_FRIEND_REQUEST",
        "payload": {
            "friend_id": db_friend.user_id,
            "friend_username": db_friend_username.username,
            "room_id": new_room.id
        }
    })

    # Sends a message to the friend that their friend request was accepted
    await manager.send_message_to([friend.friend_id], {
        "type": "ACCEPT_FRIEND_REQUEST",
        "payload": {
            "friend_id": user.id,
            "friend_username": user.username,
            "room_id": new_room.id
        }
    })

    # Send information about this new private chat room
    await manager.send_message_to([user.id, db_friend.user_id], {
        "type": "CREATE_FRIEND_CHAT",
        "payload": {
            "room_id": new_room.id,
            "participants": [
                {
                    "username": user.username,
                    "user_id": user_participant.user_id,
                }, 
                {
                    "username": db_friend_username.username,
                    "user_id": db_friend.user_id
                }
            ]
        }
    })

async def reject_friend_request(websocket: WebSocket, friend: schemas.Friend, user: models.User, db: Session, manager: ConnectionManager):
    """Rejects a friend request"""
    db_friend = db.query(models.Friend).filter(models.Friend.user_id == friend.friend_id, models.Friend.friend_id == user.id, models.Friend.status == models.FriendStatus.PENDING).first()
    if db_friend is None:
        raise WebSocketEventException("ACCEPT_FRIEND_REQUEST", "Friend request does not exist", {"friend_id": friend.friend_id})

    setattr(db_friend, 'status', models.FriendStatus.REJECTED)
    db.commit()
    db.refresh(db_friend)

    await manager.send_personal_message(websocket, {
        "type": "REJECT_FRIEND_REQUEST",
        "payload": {
            "user_id": db_friend.user_id
        }
    })

async def confirm_send_friend_request(websocket: WebSocket, friend: schemas.Friend, user: models.User, db: Session, manager: ConnectionManager):
    """Confirms and sends a friend request"""
    db_friend = db.query(models.Friend).filter(models.Friend.user_id == user.id, models.Friend.friend_id == friend.friend_id).first()

    # Check if user is already friends
    if db_friend is not None and db_friend.status == models.FriendStatus.ACCEPTED:
        raise WebSocketEventException(
                event_name="CONFIRM_SEND_FRIEND_REQUEST",
                message="You are already friends",
                other={"friend_id": friend.friend_id}
            )
    # Check if user has already sent a friend request
    elif db_friend is not None and db_friend.status == models.FriendStatus.PENDING:
        raise WebSocketEventException(
                event_name="CONFIRM_SEND_FRIEND_REQUEST",
                message="You already sent a friend request",
                other={"friend_id": friend.friend_id}
            )
    elif db_friend is not None and db_friend.status == models.FriendStatus.REJECTED:
        setattr(db_friend, 'status', models.FriendStatus.PENDING)
        db.commit()
        db.refresh(db_friend)
        db_friend_user = db.query(models.User.username).filter(models.User.id == friend.friend_id).first()
        if db_friend_user is None:
            raise WebSocketEventException("CONFIRM_SEND_FRIEND_REQUEST", "User does not exist", {"friend_id": friend.friend_id})

        await manager.send_personal_message(websocket, {
            "type": "CONFIRM_SEND_FRIEND_REQUEST",
            "payload": {
                "friend_id": friend.friend_id,
                "friend_username": db_friend_user.username
            }
        })

        await manager.send_message_to(
            [friend.friend_id],
            {
                "type": "RECEIVE_FRIEND_REQUEST",
                    "payload": {
                    "username": user.username,
                    "user_id": user.id
                }   
            }
        )

        return

    # Check if user exists
    db_friend_user = db.query(models.User.username) \
                        .filter(models.User.id == friend.friend_id) \
                        .first()

    if db_friend_user is None:
        raise WebSocketEventException(
                event_name="CONFIRM_SEND_FRIEND_REQUEST", 
                message="User does not exist", 
                other={"friend_id": friend.friend_id}
            )

    # Add friend with status of "pending" in direction of user->friend
    friend_request = models.Friend(
                        user_id=user.id,
                        friend_id=friend.friend_id,
                        status=models.FriendStatus.PENDING
                    )
    db.add(friend_request)
    db.commit()
    db.refresh(friend_request)

    await manager.send_personal_message(websocket, {
        "type": "CONFIRM_SEND_FRIEND_REQUEST",
        "payload": {
            "friend_id": friend.friend_id,
            "friend_username": db_friend_user.username
        }
    })

    await manager.send_message_to(
        [friend.friend_id],
        {
            "type": "RECEIVE_FRIEND_REQUEST",
                "payload": {
                "username": user.username,
                "user_id": user.id
            }   
        }
    )

async def get_friends(websocket: WebSocket,
                      user: models.User,
                      db: Session,
                      manager: ConnectionManager):
    """Gets friends and room ids to chat with friends"""
    # Get friends, corresponding room id, and corresponding user info
    q = db.query(models.Friend, models.User) \
            .filter((models.Friend.user_id == user.id) | (models.Friend.friend_id == user.id),
                    models.Friend.status == models.FriendStatus.ACCEPTED,
                    models.Friend.user_id == models.User.id) \
            .all()
 

    # Construct friend list
    friends = []
    for db_friend, db_user in q:
        friends.append({
            "user_id": db_user.id,
            "username": db_user.username,
            "room_id": db_friend.room_id
        })
  
    # Send friend list to user
    await manager.send_personal_message(websocket, {
        "type": "GET_FRIENDS",
        "payload": friends
    })

async def get_friend_requests(websocket: WebSocket,
                              user: models.User,
                              db: Session,
                              manager: ConnectionManager):
    """Gets pending friend requests directed towards the user"""
    # Get all friend requests directed towards user
    q = db.query(models.Friend, models.User) \
            .filter(models.Friend.friend_id == user.id, 
                    models.Friend.status == models.FriendStatus.PENDING, 
                    models.Friend.user_id == models.User.id) \
            .all   
    # Construct list of friend requests
    friend_requests = []
    for db_friend, db_user in q:
        friend_requests.append({
            "user_id": db_user.id,
            "username": db_user.username,
            "created_on": db_friend.created_on.isoformat()
        })

    # Send friend requests to user
    await manager.send_personal_message(websocket, {
        "type": "GET_FRIEND_REQUESTS",
        "payload": friend_requests
    })
