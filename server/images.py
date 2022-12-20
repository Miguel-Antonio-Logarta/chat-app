import random
import config
from PIL import Image, ImageColor, ImageFont, ImageDraw
from sqlalchemy.orm import Session
# import re

preset_gradients = {
    "kale_salad": ("#00C9FF", "#92FE9D"),
    "disco_club": ("#FC466B", "#3F5EFB"),
    "bloody_mimosa": ("#d53369", "#daae51"),
    "aqua_spray": ("#00d2ff", "#3a47d5"),
}

def select_random_gradient() -> tuple:
    """Selects a random preset gradient"""
    return random.choice(list(preset_gradients.values()))

def generate_horizontal_gradient(
        color1: str, color2: str, width: int, height: int) -> Image:
    """Generate a vertical gradient."""
    base = Image.new('RGB', (width, height), color1)
    top = Image.new('RGB', (width, height), color2)
    mask = Image.new('L', (width, height))
    mask_data = []
    for y in range(height):
        mask_data.extend([(x*255)//width for x in range(1, width + 1)])
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base

def insert_text(background: Image, text: str, font_size: int) -> Image:
    """Inserts the first two letters of the text onto an image"""
    # Get first two alphanumeric letters in the text
    # Capitalize the first letter if applicable
    # Find dimensions of image and of text
    # Center the origin of the text
    # Place the text in the center of the image
    image: Image = background.copy()
    image_editable = ImageDraw.Draw(image)
    (top_left, top_right, width, height) = image.getbbox()
    font = ImageFont.truetype(
            font=f"{config.settings.assets_folder}/fonts/Montserrat-Light.ttf",
            size=font_size
        )
    image_editable.text(
            xy=(width//2,height//2),
            text=text,
            font=font,
            fill=(255, 255, 255),
            anchor="mm"
        )
    return image

def generate_profile_picture(username: str, width: int, height: int, font_size: int) -> Image:
    """Generates a profile picture"""
    left_color, right_color = select_random_gradient()
    profile_picture = generate_horizontal_gradient(left_color, right_color, width, height)

    # Find first and second alphanumeric characters to use as initials
    first_index = find_alphanum(username)
    second_index = find_alphanum(username, first_index + 1)
    initials = username[first_index].capitalize()
    # Add second initial if found
    if second_index >= 0:
        initials += username[second_index]

    profile_picture = insert_text(profile_picture, initials, font_size)

    return profile_picture

def find_alphanum(username: str, start: int = 0) -> int:
    """Returns index of first alphanumeric character, if not found, returns -1"""
    for i in range(start, len(username)):
        if username[i].isalnum():
            return i
    
    return -1

def create_profile_picture(username: str) -> str:
    """Creates a profile picture and returns path of where it is stored"""
    image = generate_profile_picture(username, 140, 140, 65)
    # TODO: instead of naming the file after the username, name it with the id instead.
    path = f'{config.settings.assets_folder}/images/{username}.png'
    image.save(path)
    return path
    # for c in username:
    # If no profile picture is provided, generate profile picture
    # Else
        # Crop profile picture and create different sizes
        # Store images online
        # Store links to images in database
        # Return links to profile picture

