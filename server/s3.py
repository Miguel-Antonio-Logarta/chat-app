import boto3
import config

class S3Manager:
    # Connects to s3 for file uploading and downloading
    def __init__(self) -> None:
        self.s3 = boto3.client("s3")

    def upload_file(self, f, output_filename: str):
        self.s3.upload_fileobj(
            f,
            config.settings.s3_bucket_name,
            output_filename,
            ExtraArgs={
                'ACL': 'public-read'
            }
        )

    def get_file(self):
        pass
