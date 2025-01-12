import os
from google.cloud import vision
from pdf2image import convert_from_path


def parse_text_from_image(file_path: str, credentials_path: str) -> str:
    """
    Parses text from a file (image or PDF) using Google Vision API
    with the credentials loaded from a local JSON file.

    Args:
        file_path (str): The path to the file (image or PDF).
        credentials_path (str): The path to the service account JSON key file.

    Returns:
        str: The extracted text from the file.
    """
    # Set the environment variable for Google credentials
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path

    # Create a Vision API client
    client = vision.ImageAnnotatorClient()

    # Check if the file is a PDF or an image
    file_extension = file_path.lower().split('.')[-1]

    if file_extension == 'pdf':
        # If it's a PDF, convert it to images (one per page)
        pages = convert_from_path(file_path, 300)  # 300 dpi for better quality
        full_text = ""
        for page in pages:
            # Convert each page to a byte array
            with open("temp_page.jpg", "wb") as temp_image:
                page.save(temp_image, 'JPEG')
                temp_image.close()

            # Read the image file
            with open("temp_page.jpg", "rb") as image_file:
                content = image_file.read()

            # Set up the image to be analyzed
            image = vision.Image(content=content)

            # Call the API for text detection
            response = client.text_detection(image=image)

            # Check for errors in the response
            if response.error.message:
                raise Exception(f"Google Vision API error: {response.error.message}")

            # Add the text from this page to the full text
            if response.text_annotations:
                full_text += response.text_annotations[0].description.strip() + "\n"

        return full_text.strip()

    elif file_extension in ['png', 'jpg', 'jpeg', 'tiff']:
        # If it's an image, process it directly
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

    else:
        raise ValueError("Unsupported file type. Only PDF and image files are supported.")
