import os
from google.cloud import vision


def parse_text_from_image(file_path: str, credentials_path: str) -> str:
    """
    Parses text from an image using Google Vision API
      with the credentials loaded from a local JSON file.

    Args:
        file_path (str): The path to the image file.
        credentials_path (str): The path to the service account JSON key file.

    Returns:
        str: The extracted text from the image.
    """
    # Set the environment variable for Google credentials
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path

    # Create a Vision API client
    client = vision.ImageAnnotatorClient()

    # Read the image file
    with open(file_path, "rb") as image_file:
        content = image_file.read()

    # Set up the image to be analyzed
    image = vision.Image(content=content)

    # Call the API for text detection
    response = client.text_detection(image=image)

    # Check for errors in the response
    if response.error.message:
        raise Exception(f"Google Vision API error: {response.error.message}")

    # Return the first text annotation found in the image
    if response.text_annotations:
        return response.text_annotations[0].description.strip()
    return ""
