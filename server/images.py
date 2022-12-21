import random
import config
import io
from PIL import Image, ImageColor, ImageFont, ImageDraw
from sqlalchemy.orm import Session
from s3 import S3Manager
# import re

preset_gradients = {
    "blue_to_green": ("#00C9FF", "#92FE9D"),
    "pink_to_blue": ("#FC466B", "#3F5EFB"),
    "pink_to_yellow": ("#d53369", "#daae51"),
    "bright_blue_to_dark_blue": ("#00d2ff", "#3a47d5"),
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
    print("yaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    print(f"{config.settings.assets_folder}/fonts/Montserrat-Light.ttf")
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


def find_alphanum(username: str, start: int = 0) -> int:
    """Returns index of first alphanumeric character, if not found, returns -1"""
    for i in range(start, len(username)):
        if username[i].isalnum():
            return i
    
    return -1


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


def upload_profile_picture(pil_image: Image, output_filename: str, s3: S3Manager):
    """Uploads profile picture Image object to s3"""
    in_mem_file = io.BytesIO()
    pil_image.save(in_mem_file, format="PNG")
    in_mem_file.seek(0)
    s3.upload_file(in_mem_file, f"{config.settings.s3_profile_images_location}{output_filename}.png")


def create_profile_picture(username: str, user_id: int, s3: S3Manager) -> None:
    """Creates a profile picture and uploads it to s3"""
    # TODO: instead of naming the file after the username, name it with the id instead.
    # If no profile picture is provided, generate profile picture
    image = generate_profile_picture(username, 140, 140, 65)
    image.show()

    upload_profile_picture(pil_image=image, output_filename=f"{user_id}", s3=s3)