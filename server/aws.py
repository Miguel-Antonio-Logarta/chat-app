import boto3

class S3Handler:
    def __init__(self) -> None:
        self.s3 = boto3.client()

    def upload_file(self):
        pass

    def get_file(self):
        pass