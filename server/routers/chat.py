import json
from fastapi import Depends, WebSocket, APIRouter, WebSocketDisconnect, status
from pydantic import ValidationError
from sqlalchemy.orm import Session
import models
import schemas
from database import get_db
from auth import ws_get_current_user
import chat_events
from connection_manager import ConnectionManager
from errors import WebSocketEventException
# from server.chat_events import get_group_chats

router = APIRouter()
manager = ConnectionManager()

@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    user: None | models.User = Depends(ws_get_current_user),
    db: Session = Depends(get_db)
):
    await websocket.accept()

    if not user:
        return await websocket.close(code=status.WS_1008_POLICY_VIOLATION)

    # await manager.connect(websocket)
    await manager.connect(websocket, user, db)

    while True:
        try:
            data = await websocket.receive_text()
            parsed_data = schemas.WSDataReceive(**json.loads(data))
            match parsed_data.type:
                # case "PING":
                #     await chat_events.pong(websocket, manager)
                case "SEND_MESSAGE":
                    message = schemas.SendMessage(**parsed_data.payload)
                    await chat_events.send_message(websocket, message, user, db, manager)
                case "GET_MESSAGES":
                    room = schemas.Room(**parsed_data.payload)
                    await chat_events.get_messages(websocket, room, user, db, manager)
                case "GET_ROOMS":
                    await chat_events.get_rooms(websocket, user, db, manager)
                case "GET_ROOM_INFO":
                    room = schemas.Room(**parsed_data.payload)
                    await chat_events.get_room_info(websocket, room, user, db, manager)
                case "GET_GROUP_CHATS":
                    await chat_events.get_group_chats(websocket, user, db, manager)
                case "CREATE_GROUP_CHAT":
                    new_room = schemas.CreateRoom(**parsed_data.payload)
                    await chat_events.create_group_chat(websocket, new_room, user, db, manager)
                case "LEAVE_GROUP_CHAT":
                    room = schemas.Room(**parsed_data.payload)
                    await chat_events.leave_group_chat(websocket, room, user, db, manager)
                case "JOIN_GROUP_CHAT":
                    room = schemas.Room(**parsed_data.payload)
                    await chat_events.join_group_chat(websocket, room, user, db, manager)
                case "CONFIRM_JOIN_GROUP_CHAT":
                    room = schemas.Room(**parsed_data.payload)
                    await chat_events.confirm_join_group_chat(websocket, room, user, db, manager)
                case "INVITE_TO_GROUP_CHAT":
                    invite = schemas.InviteToGroupChat(**parsed_data.payload)
                    await chat_events.invite_friend_to_group_chat(websocket, invite, user, db, manager)
                case "GET_FRIENDS":
                    await chat_events.get_friends(websocket, user, db, manager)
                case "GET_FRIEND_REQUESTS": 
                    await chat_events.get_friend_requests(websocket, user, db, manager)
                case "SEND_FRIEND_REQUEST":
                    friend = schemas.Friend(**parsed_data.payload)
                    await chat_events.send_friend_request(websocket, friend, user, db, manager)
                case "CONFIRM_SEND_FRIEND_REQUEST":
                    friend = schemas.Friend(**parsed_data.payload)
                    await chat_events.confirm_send_friend_request(websocket, friend, user, db, manager)
                case "ACCEPT_FRIEND_REQUEST":
                    friend = schemas.Friend(**parsed_data.payload)
                    await chat_events.accept_friend_request(websocket, friend, user, db, manager)
                case "REJECT_FRIEND_REQUEST":
                    friend = schemas.Friend(**parsed_data.payload)
                    await chat_events.reject_friend_request(websocket, friend, user, db, manager)
                case _:
                    await websocket.send_json({"type": "NOT_FOUND", "payload": "No matching event"})
        except WebSocketEventException as err:
            await manager.send_personal_message(websocket, {
                "type": "ERROR",
                "payload": err.as_payload()
            })
        except ValidationError as err:
            await manager.send_personal_message(websocket, {
                "type": "ERROR",
                "payload": json.loads(err.json())
            })
            # continue to prevent disconnection
            continue
        except WebSocketDisconnect:
            print("User has disconnected")
            manager.disconnect(user, db)
            return

