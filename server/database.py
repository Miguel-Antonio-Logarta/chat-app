from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import config

SQLALCHEMY_DATABASE_URL = f"postgresql+psycopg2://{config.settings.db_username}:{config.settings.db_password}@{config.settings.db_hostname}:{config.settings.db_port}/{config.settings.db_name}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

# NOTES FOR MYSELF
# get_db what I think is a python generator. Whenever we called get_db(), it will call
# SessionLocal() which returns a sessionmaker. sessionmaker is a database connection
# and we open it to do some things, then close it after we're done making changes to the database.
# After we call SessionLocal(), we return result through 'yield'. Once the function is done using get_db(),
# We lose the reference sessionmaker, which causes the 'finally' block to run, which closes the session 
# 
# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def db_context_manager():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()