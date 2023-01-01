from pydantic import BaseSettings


class Settings(BaseSettings):
    db_username: str
    db_password: str
    db_hostname: str
    db_port: str
    db_name: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    cors: str
    test_token: str
    assets_folder: str
    s3_bucket_name: str
    s3_base_object_url: str
    s3_profile_images_location: str
    s3_gc_icon_location: str

    class Config:
        env_file = ".env"


settings = Settings()
