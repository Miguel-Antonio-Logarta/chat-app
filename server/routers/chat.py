from typing import List, Union
from fastapi import Depends, WebSocket, APIRouter, WebSocketDisconnect, status
from pydantic import ValidationError
from sqlalchemy.orm import Session
import json
import models
import schemas
from database import get_db
from auth import ws_get_current_user

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str | dict, websocket: WebSocket, send_json: bool = False):
        if send_json:
            await websocket.send_text(json.dumps(message, indent=4, sort_keys=True, default=str))
        else:
            await websocket.send_text(message)
            

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

async def ws_send_message(websocket: WebSocket, message: schemas.SendMessage, user: models.User, db: Session, manager: ConnectionManager):
    """Sends a message to a room"""
    db_message = models.Message(**message.dict(), room_id=0, user_id=user.id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    await manager.broadcast(json.dumps({
            "type": "SEND_MESSAGE",
            "payload": {
                "id": db_message.id,
                "username": user.username,
                "message": db_message.message,
                "timestamp": db_message.created_on
            }
        }, indent=4, sort_keys=True, default=str)
    )

async def ws_get_rooms():
    """Gets all rooms that the user is a part of"""
    pass

async def ws_create_room():
    """Creates a room with user as the participant"""
    pass

async def ws_leave_room():
    """Leaves a room"""
    pass

async def ws_send_friend_request():
    """Sends a friend request"""
    pass

async def ws_add_friend():
    """Accepts a friend request"""
    pass

async def ws_invite_friend():
    """Invites a friend to a room. User must belong to the room to invite friend"""
    pass

async def ws_get_messages(websocket: WebSocket, user: models.User, db: Session, manager: ConnectionManager):
    """Gets all messages from a room"""
    query = db.query(models.Message, models.User).filter(models.Message.user_id == models.User.id).all()
    messages_out: List[schemas.SendMessage] = []
    for db_message, db_user in query:
        messages_out.append({
            "id": db_message.id,
            "username": db_user.username,
            "message": db_message.message,
            "timestamp": db_message.created_on
        })
    await manager.send_personal_message({
        "type": "GET_MESSAGES",
        "payload": messages_out
    }, websocket, send_json=True)


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    q: Union[int, None] = None,
    user: None | models.User = Depends(ws_get_current_user),
    db: Session = Depends(get_db)
):
    await websocket.accept()

    if not user:
        return await websocket.close(code=status.WS_1008_POLICY_VIOLATION)

    await manager.connect(websocket)

    while True:
        try:
            data = await websocket.receive_text()
            parsed_data = schemas.WSDataReceive(**json.loads(data))
            # Make sure to handle key error here
            match parsed_data.type:
                case "SEND_MESSAGE":
                    message = schemas.SendMessage(**parsed_data.payload)
                    await ws_send_message(websocket, message, user, db, manager)
                case "GET_MESSAGES":
                    await ws_get_messages(websocket, user, db, manager)
                case _:
                    await websocket.send_json({"type": "NOT_FOUND", "payload": "No matching event"})

        except ValidationError as err:
            await manager.send_personal_message({
                "type": "ERROR",
                "payload": json.loads(err.json())
            }, websocket, send_json=True)
            # continue to prevent disconnection
            continue
        except WebSocketDisconnect:
            manager.disconnect(websocket)
            return

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
