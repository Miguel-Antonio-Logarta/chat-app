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

class TokenData(BaseModel):
    username: Union[str, None] = None


class User(BaseModel):
    username: str
    email: Union[str, None] = None
    full_name: Union[str, None] = None
    disabled: Union[bool, None] = None


class UserInDB(User):
    hashed_password: str

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
        if len(v) < 6 or len(v) > 64:
            raise ValueError('Password is too short or too long')
        return v
        # if 6 >= len(v) >= 64:

