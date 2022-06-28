class WSError(Exception):
    def __init__(self, payload_message: str, payload_extra: dict):
        self.message = payload_message
        self.extra_messages = payload_extra
        super().__init__(self.message)
    # def __repr__()