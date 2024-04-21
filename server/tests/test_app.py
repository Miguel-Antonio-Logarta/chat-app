from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_app():
    print("Running test_app() test")
    assert 1 == 1