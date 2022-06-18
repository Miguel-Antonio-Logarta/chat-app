from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
# from auth import verify_password, get_current_active_user, create_access_token, User, ACCESS_TOKEN_EXPIRE_MINUTES
import auth
from fastapi.security import OAuth2PasswordRequestForm
import schemas
from database import get_db
import models
router = APIRouter()

@router.post("/user")
async def create_user(create_user: schemas.CreateUser, db: Session = Depends(get_db)):
    # Check if the username is already taken 
    username_exists = db.query(models.User).filter(models.User.username == create_user.username).first()
    if username_exists is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already exists"
        )
    # Check if the email is already taken
    email_exists = db.query(models.User).filter(models.User.email == create_user.email).first()
    if email_exists is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already exists"
        )
    # Hash the password and store in db
    create_user.password = auth.get_password_hash(create_user.password)
    new_user = models.User(**create_user.dict())
    db.add(new_user)
    db.commit()

    # Return a token since the user will automatically log in after signing up
    access_token = auth.create_access_token(data={"user_id": new_user.id, "username": new_user.username})
    res = {"access_token": access_token, "token_type": "bearer"}
    return res


@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    # user = db.query(models.User).filter(models.User.username)
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Username or password does not match",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Verify username and password
    if user is None:
        raise credentials_exception
    elif not auth.verify_password(form_data.password, user.password):
        raise credentials_exception

    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me/", response_model=auth.User)
async def read_users_me(current_user: auth.User = Depends(auth.get_current_active_user)):
    return current_user


@router.get("/users/me/items/")
async def read_own_items(current_user: auth.User = Depends(auth.get_current_active_user)):
    return [{"item_id": "Foo", "owner": current_user.username}]