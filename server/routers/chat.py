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
from s3 import S3Manager
# from server.chat_events import get_group_chats

router = APIRouter()
connection_manager = ConnectionManager()
s3_manager = S3Manager()

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
    await connection_manager.connect(websocket, user, db)

    while True:
        try:
            data = await websocket.receive_text()
            parsed_data = schemas.WSDataReceive(**json.loads(data))
            match parsed_data.type:
                # case "PING":
                #     await chat_events.pong(websocket, connection_manager)
                case "SEND_MESSAGE":
                    message = schemas.SendMessage(**parsed_data.payload)
                    await chat_events.send_message(websocket, message, user, db, connection_manager)
                case "GET_MESSAGES":
                    room = schemas.Room(**parsed_data.payload)
                    await chat_events.get_messages(websocket, room, user, db, connection_manager)
                case "GET_ROOMS":
                    await chat_events.get_rooms(websocket, user, db, connection_manager)
                case "GET_ROOM_INFO":
                    room = schemas.Room(**parsed_data.payload)
                    await chat_events.get_room_info(websocket, room, user, db, connection_manager)
                case "GET_GROUP_CHATS":
                    await chat_events.get_group_chats(websocket, user, db, connection_manager)
                case "CREATE_GROUP_CHAT":
                    new_room = schemas.CreateRoom(**parsed_data.payload)
                    await chat_events.create_group_chat(websocket, new_room, user, db, connection_manager, s3_manager)
                case "LEAVE_GROUP_CHAT":
                    room = schemas.Room(**parsed_data.payload)
                    await chat_events.leave_group_chat(websocket, room, user, db, connection_manager)
                case "JOIN_GROUP_CHAT":
                    room = schemas.Room(**parsed_data.payload)
                    await chat_events.join_group_chat(websocket, room, user, db, connection_manager)
                case "CONFIRM_JOIN_GROUP_CHAT":
                    room = schemas.Room(**parsed_data.payload)
                    await chat_events.confirm_join_group_chat(websocket, room, user, db, connection_manager)
                case "INVITE_TO_GROUP_CHAT":
                    invite = schemas.InviteToGroupChat(**parsed_data.payload)
                    await chat_events.invite_friend_to_group_chat(websocket, invite, user, db, connection_manager)
                case "GET_FRIENDS":
                    await chat_events.get_friends(websocket, user, db, connection_manager)
                case "GET_FRIEND_REQUESTS": 
                    await chat_events.get_friend_requests(websocket, user, db, connection_manager)
                case "SEND_FRIEND_REQUEST":
                    friend = schemas.Friend(**parsed_data.payload)
                    await chat_events.send_friend_request(websocket, friend, user, db, connection_manager)
                case "CONFIRM_SEND_FRIEND_REQUEST":
                    friend = schemas.Friend(**parsed_data.payload)
                    await chat_events.confirm_send_friend_request(websocket, friend, user, db, connection_manager)
                case "ACCEPT_FRIEND_REQUEST":
                    friend = schemas.Friend(**parsed_data.payload)
                    await chat_events.accept_friend_request(websocket, friend, user, db, connection_manager)
                case "REJECT_FRIEND_REQUEST":
                    friend = schemas.Friend(**parsed_data.payload)
                    await chat_events.reject_friend_request(websocket, friend, user, db, connection_manager)
                case "GET_LATEST_MESSAGES":
                    messages_request = schemas.LatestMessages(**parsed_data.payload)
                    await chat_events.get_lastest_messages(websocket, messages_request, user, db, connection_manager)
                case _:
                    await websocket.send_json({"type": "NOT_FOUND", "payload": "No matching event"})
        except WebSocketEventException as err:
            await connection_manager.send_personal_message(websocket, {
                "type": "ERROR",
                "payload": err.as_payload()
            })
        except ValidationError as err:
            await connection_manager.send_personal_message(websocket, {
                "type": "ERROR",
                "payload": json.loads(err.json())
            })
            # continue to prevent disconnection
            continue
        except WebSocketDisconnect:
            print("User has disconnected")
            connection_manager.disconnect(user, db)
            return

