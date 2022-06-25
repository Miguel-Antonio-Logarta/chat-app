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

router = APIRouter()
manager = ConnectionManager()

@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    # q: Union[int, None] = None,
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
            match parsed_data.type:
                case "SEND_MESSAGE":
                    message = schemas.SendMessage(**parsed_data.payload)
                    await chat_events.ws_send_message(websocket, message, user, db, manager)
                case "GET_MESSAGES":
                    await chat_events.ws_get_messages(websocket, user, db, manager)
                case "CREATE_ROOM":
                    new_room = schemas.CreateRoom(**parsed_data.payload)
                    await chat_events.ws_create_room(websocket, new_room, user, db, manager)
                case "LEAVE_ROOM":
                    room = schemas.LeaveRoom(**parsed_data.payload)
                    await chat_events.ws_leave_room(websocket, room, user, db, manager)
                case "JOIN_ROOM":
                    room = schemas.JoinRoom(**parsed_data.payload)
                    await chat_events.ws_join_room(websocket, room, user, db, manager)
                case "GET_ROOMS":
                    await chat_events.ws_get_rooms(websocket, user, db, manager)
                case _:
                    await websocket.send_json({"type": "NOT_FOUND", "payload": "No matching event"})

        except ValidationError as err:
            await manager.send_personal_message({
                "type": "ERROR",
                "payload": json.loads(err.json())
            }, websocket)
            # continue to prevent disconnection
            continue
        except WebSocketDisconnect:
            manager.disconnect(websocket)
            return

