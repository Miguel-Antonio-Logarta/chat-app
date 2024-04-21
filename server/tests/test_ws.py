from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_websocket():
    with client.websocket_connect("/ws") as websocket:
        pass