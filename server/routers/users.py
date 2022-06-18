from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session
from datetime import timedelta
import auth
import schemas
from database import get_db
import models
import config

router = APIRouter()

@router.post("/users/signup", response_model=schemas.Token)
async def create_user(new_user_data: schemas.CreateUser, db: Session = Depends(get_db)):
    errors = {}
    # Check if the username is already taken 
    username_exists = db.query(models.User).filter(models.User.username == new_user_data.username).first()
    if username_exists is not None:
        errors["username"] = "Username already exists"
        # raise HTTPException(
        #     status_code=status.HTTP_409_CONFLICT,
        #     detail="Username already exists"
        # )
    # Check if the email is already taken
    email_exists = db.query(models.User).filter(models.User.email == new_user_data.email).first()
    if email_exists is not None:
        errors["email"] = "Email already exists"
        # raise HTTPException(
        #     status_code=status.HTTP_409_CONFLICT,
        #     detail="Email already exists"
        # )
    
    if errors:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=errors
        )
    
    # Hash the password and store in db
    new_user_data.password = auth.get_password_hash(new_user_data.password)
    new_user = models.User(**new_user_data.dict())
    db.add(new_user)
    db.commit()

    # Return a token since the user will automatically log in after signing up
    access_token = auth.create_access_token(data={"user_id": new_user.id, "username": new_user.username})
    res = {"access_token": access_token, "token_type": "bearer"}
    return res


@router.post("/users/login", response_model=schemas.Token)
async def login_for_access_token(credentials: schemas.LoginUser, db: Session = Depends(get_db)):
    # Check if the username or email exists
    user = db.query(models.User).filter(or_(models.User.username == credentials.usernameOrEmail, models.User.email == credentials.usernameOrEmail)).first()
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Username or password does not match",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Verify if we found the user and if the password is correct
    if user is None:
        raise credentials_exception
    elif not auth.verify_password(credentials.password, user.password):
        raise credentials_exception

    # Give token
    access_token_expires = timedelta(minutes=config.settings.access_token_expire_minutes)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# @router.get("/users/me/", response_model=auth.User)
# async def read_users_me(current_user: auth.User = Depends(auth.get_current_user)):
#     return current_user


# @router.get("/users/me/items/")
# async def read_own_items(current_user: auth.User = Depends(auth.get_current_user)):
#     return [{"item_id": "Foo", "owner": current_user.username}]