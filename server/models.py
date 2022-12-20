import enum
from sqlalchemy import Enum, Text, UniqueConstraint
from sqlalchemy import BigInteger, Boolean, Column, ForeignKey, Integer, String, Date, TIMESTAMP
from sqlalchemy.sql.expression import text
from database import Base


class FriendStatus(enum.Enum):
    ACCEPTED = 1
    PENDING = 2
    REJECTED = 3

class User(Base):
    __tablename__ = "User"
    id = Column(BigInteger, primary_key=True, index=True)
    username = Column(String(30), nullable=False, unique=True)
    email = Column(String(254), unique=True)
    password = Column(String(256), nullable=False)
    created_on = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text('now()')
    )
    profile_picture = Column(Text, nullable=True)


class Message(Base):
    __tablename__ = "Message"
    id = Column(BigInteger, primary_key=True, index=True)
    room_id = Column(BigInteger, ForeignKey("Room.id"), nullable=False)
    user_id = Column(BigInteger, ForeignKey("User.id"), nullable=False)
    message = Column(String(2000), nullable=False)
    created_on = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text('now()')
    )

class Room(Base):
    __tablename__ = "Room"
    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(64), nullable=False)
    is_group_chat = Column(Boolean, nullable=False, server_default=text('False'))
    created_on = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text('now()')
    )

class Participant(Base):
    __tablename__ = "Participant"
    id = Column(BigInteger, primary_key=True, index=True)
    room_id = Column(BigInteger, ForeignKey("Room.id"), nullable=False)
    user_id = Column(BigInteger, ForeignKey("User.id"), nullable=False)
    created_on = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text('now()')
    )
    __table_args__ = (UniqueConstraint('room_id', 'user_id', name="unique_user_per_room"),)

class OnlineUser(Base):
    __tablename__ = "OnlineUser"
    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("User.id"), unique=True, nullable=False)
    current_room_id = Column(BigInteger, ForeignKey("Room.id"), nullable=True)

class Friend(Base):
    __tablename__ = "Friend"
    id = Column(BigInteger, primary_key=True, nullable=False, index=True)
    user_id = Column(BigInteger, ForeignKey("User.id"), nullable=False)
    friend_id = Column(BigInteger, ForeignKey("User.id"), nullable=False)
    status = Column(Enum(FriendStatus), nullable=False)
    room_id = Column(BigInteger, ForeignKey("Room.id"), nullable=True)
    created_on = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text('now()')
    )
    __table_args__ = (UniqueConstraint('user_id', 'friend_id', name="unique_one_friend_request_per_user"),)
