from fastapi.testclient import TestClient
from app import app
import config

def test_get_messages():
    client = TestClient(app)
    with client.websocket_connect(f"/ws?token={config.settings.test_token}") as websocket:
        # res = websocket.receive_json()
        websocket.send_json({
            "type": "GET_MESSAGES",
            "payload": ""
        })
        data = websocket.receive_json()
        # ... Assert here ...
