from typing import Dict, Callable
from database import get_db
from sqlalchemy.orm import Session

# A subclass of the python dictionary that allows you to only write a key-value pair once
class EventDictionary(dict):
    def __setitem__(self, key: str, value: Callable):
        try:
            retrieved_value = self[key]
        except KeyError:
            super(EventDictionary, self).__setitem__(key, value)
        if retrieved_value != value:
            # We received two different functions for one event name
            raise KeyError('Event name "%s" already exists!' % key)

# A websocket event handler
class WSEventHandler:
    def __init__(self) -> None:
        self.mapped_events: EventDictionary = {}
    
    def register_event(self, event: str, func: Callable) -> None:
        assert event not in self.mapped_events, f"Duplicate event: {event}"
        self.mapped_events[event] = func

    def on_event(self, event_name: str) -> Callable:
        def wrapped_decorator(func) -> Callable:
            def wrapped_callable(*args, **kwargs) -> Callable:
                print("Adding function to mapped events");
                self.register_event(event_name, func)
                return func(*args, **kwargs)
            return wrapped_callable        
        return wrapped_decorator
    
    def process_event(self, event: str, payload: any) -> None:
        if event not in self.mapped_events:
            print(f"Event {event} does not exist")
        else:
            procedure = self.mapped_events[event]
            procedure(payload)

    def include_events(self, route: WSEventHandler) -> None:
        self.mapped_events.update(route.mapped_events)


# Instantiate the class
ws_example = WSEventHandler()
ws_example.process_event("GET_FRIENDS", {"id": 34834, "name": "something something"})

# Doing this registers an event. When the websocket endpoint receives "GET_FRIENDS", it will call the function 
# get_friends()
@ws_example.on_event("GET_FRIENDS")
async def get_friends():
    pass

# This is how we'll handle separate files. We link them with a router
ws_router = ws_router()
@ws_router.on_event("DELETE_FRIENDS")
async def delete_friends():
    pass

# In the main file, we'll include a router. So now we have access to "GET_FRIENDS" and "DELETE_FRIENDS"
ws_example.include_events(somefile.ws_router)

# If we want to include a database injection into our websocket, we can also do this
@ws_example.on_event("REMOVE_FRIEND")
async def remove_friend(db: Session = get_db()):
    pass