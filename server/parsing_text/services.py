import os
import re
from google.cloud import vision
from pdf2image import convert_from_path


def remove_numbers_and_cleanup(text: str) -> str:
    """
    Removes all numeric digits from the given text, 
    and also removes lines that are less than 2 characters or consist of only a single character (e.g., '.' or 'a').
    
    Args:
        text (str): The input text with numbers.
        
    Returns:
        str: The cleaned text with numbers and unnecessary lines removed.
    """
    # הסרת מספרים
    text = re.sub(r'\d+', '', text)
    
    # הסרת שורות עם פחות משתי אותיות או שורות עם תו אחד בלבד
    # כאן בודקים אם השורה מכילה לפחות 2 תווים משמעותיים
    text = "\n".join([line for line in text.split("\n") if len(re.findall(r'[a-zA-Zא-ת]', line.strip())) > 1])

    # הסרת שורות שמכילות תו בודד בלבד כמו נקודה או תו בודד אחר
    text = re.sub(r'^\s*[\.\-a-zA-Z]{1,2}\s*$', '', text, flags=re.MULTILINE)
    
    # הסרת שורות ריקות אם נשארו
    text = re.sub(r'\n+', '\n', text).strip()

    return text


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
    temp_image_path = "temp_page.jpg"  # Temporary image path

    try:
        if file_extension == 'pdf':
            # If it's a PDF, convert it to images (one per page)
            pages = convert_from_path(file_path, 300)  # 300 dpi for better quality
            full_text = ""
            for page in pages:
                # Convert each page to a byte array
                with open(temp_image_path, "wb") as temp_image:
                    page.save(temp_image, 'JPEG')

                # Read the image file
                with open(temp_image_path, "rb") as image_file:
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
                    page_text = response.text_annotations[0].description.strip()
                    full_text += remove_numbers_and_cleanup(page_text) + "\n"  # Remove numbers from the text

            return full_text.strip()

        elif file_extension in ['png', 'jpg', 'jpeg', 'tiff']:#adding more image formats like in the client
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

            # Return the first text annotation found in the image, after removing numbers
            if response.text_annotations:
                return remove_numbers_and_cleanup(response.text_annotations[0].description.strip())

        else:
            raise ValueError("Unsupported file type. Only PDF and image files are supported.")

    finally:
        # Ensure the temporary image file is deleted
        if os.path.exists(temp_image_path):
            os.remove(temp_image_path)
