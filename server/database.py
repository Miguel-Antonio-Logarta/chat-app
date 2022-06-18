from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import config

DB_NAME="chat-app"
DB_ADDRESS="127.0.0.1"
SQLALCHEMY_DATABASE_URL = f"postgresql+psycopg2://postgres:Cool1155@{DB_ADDRESS}:5432/{DB_NAME}"
# SQLALCHEMY_DATABASE_URL = f"postgresql+psycopg2://{config.settings.db_username}:{config.settings.db_password}@{config.settings.db_hostname}:{config.settings.db_port}/{config.settings.db_name}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# try:
#     engine.execute("USE 'chat-app'")
# except Exception as err:
#     print(f'Database not found: {err}')

Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()