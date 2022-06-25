from datetime import datetime
from typing import Union
from pydantic import BaseModel, EmailStr, validator
import re

class EmailEmptyAllowedStr(EmailStr):
    @classmethod
    def validate(cls, value: str) -> str:
        if value == "":
            return value
        return super().validate(value)


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenAndUser(Token):
    username: str
    user_id: int


class TokenData(BaseModel):
    username: Union[str, None] = None


class User(BaseModel):
    id: int
    username: str
    email: EmailEmptyAllowedStr
    created_on: datetime

    class Config: 
        orm_mode = True


class LoginUser(BaseModel):
    usernameOrEmail: str
    password: str


class CreateUser(BaseModel):
    username: str
    email: EmailEmptyAllowedStr
    password: str

    @validator('username')
    def validate_username(cls, v):
        # Usernames are alphanumeric, but can have hyphens (-) and underscores (_) in them
        # Usernames also need to be between 6 to 30 characters long
        usernameRe = r"^[A-Za-z0-9_-]{6,30}$"
        if re.search(v, usernameRe):
            raise ValueError('Username is not valid')
        return v
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password is too short (minimum is 6 characters long)')
        elif len(v) > 64:
            raise ValueError('Password is too long (maximum is 64 characters long)')
        else:
            return v

class SendMessage(BaseModel):
    message: str

class SendMessageOut(BaseModel):
    id: int
    user_id: int
    room_id: int
    username: str
    message: str
    timestamp: datetime

    # @validator('timestamp')
    # def sdflkjsdf(dfkj, sdfkjsdf: datetime):
    #     sdfkjsdf.isoformat()

class WSDataReceive(BaseModel):
    type: str
    payload: dict

class CreateRoom(BaseModel):
    name: str
    is_group_chat: bool = False

    @validator('name')
    def check_name_length(cls, v):
        if len(v) > 64:
            raise ValueError('Group chat name is too long')
        else:
            return v

class LeaveRoom(BaseModel):
    room_id: int

class JoinRoom(BaseModel):
    room_id: int