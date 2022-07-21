class WebSocketEventException(Exception):
    """Exception class for errors that happen within an event"""
    def __init__(self, event_name: str, message: str, other: dict = None):
        self.event_name = event_name
        self.message = message
        self.other = other
        super().__init__(self.message)

    def __str__(self) -> str:
        return f"WebSocketEventException in '{self.event_name}' event: {self.message}"

    def as_payload(self) -> dict:
        """
        Returns a dictionary representation of the error
        {
            "event_type": event_name,
            "message": message,
            **other
        }
        
        """
        rest_of_payload = {}
        if self.other is not None:
            rest_of_payload = {**self.other}

        return {
            'event_type': self.event_name,
            'message': self.message,
            **rest_of_payload
        }