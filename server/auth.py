from datetime import datetime, timedelta
from typing import Union
from fastapi import Depends, HTTPException, Query, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import JWTError, jwt
from sqlalchemy.orm import Session
import database
import models
from schemas import TokenData
import config

pwd_context = CryptContext(schemes=['bcrypt'], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=config.settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, config.settings.secret_key, algorithm=config.settings.algorithm)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, config.settings.secret_key, algorithms=[config.settings.algorithm])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.username == token_data.username).first()
    if user is None:
        raise credentials_exception
    return user

# Need to test this.
# Test cases: Blank token string, username is ommitted inside jwt token, username is blank in jwt token
# username does not exist in database, etc...
# Check expired jwt
async def ws_get_current_user(token: str = Query(...), db: Session = Depends(database.get_db)) -> None | models.User:
    """Gets the current user from token. If it is not valid, get_current_user returns None"""
    if not token:
        return None
    
    try:
        payload = jwt.decode(token, config.settings.secret_key, algorithms=[config.settings.algorithm])
        username: str = payload.get("sub")
        if username is None:
            return None
        token_data = TokenData(username=username)
    except JWTError:
        return None
    
    user = db.query(models.User).filter(models.User.username == token_data.username).first()
    if user is None:
        return None
    
    return user

    
