from sqlalchemy import BigInteger, Boolean, Column, ForeignKey, Integer, String, Date, TIMESTAMP
from sqlalchemy.sql.expression import text
from database import Base

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

