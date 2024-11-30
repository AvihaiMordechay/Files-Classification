import os
from google.cloud import secretmanager
from google.cloud import vision


def get_secret(secret_name: str, project_id: str) -> str:
    """
    Retrieves a secret from Google Secret Manager.

    Args:
        secret_name (str): The name of the secret.
        project_id (str): The Google Cloud project ID.

    Returns:
        str: The secret's value as a string.
    """
    client = secretmanager.SecretManagerServiceClient()
    secret_path = f"projects/{project_id}/secrets/{secret_name}/versions/latest"
    response = client.access_secret_version(request={"name": secret_path})
    return response.payload.data.decode("UTF-8")


def parse_text_from_image(file_path: str, project_id: str, secret_name: str) -> str:
    """
    Parses text from an image using Google Vision API.

    Args:
        file_path (str): The path to the image file.
        project_id (str): The Google Cloud project ID.
        secret_name (str): The name of the secret containing credentials.

    Returns:
        str: The extracted text from the image.
    """
    # Retrieve the credentials from Secret Manager
    key_data = get_secret(secret_name, project_id)

    # Create a temporary JSON file with the credentials
    temp_key_path = "/tmp/google_key.json"
    with open(temp_key_path, "w") as temp_file:
        temp_file.write(key_data)

    # Set the environment variable for Google credentials
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = temp_key_path

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
