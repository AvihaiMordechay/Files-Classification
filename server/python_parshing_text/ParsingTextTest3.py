import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = r'/opt/homebrew/bin/tesseract'

# פונקציה לפענוח תמונה לטקסט
def extract_text_from_image(image_path, lang='heb+eng'):
    """
    Extract text from an image using pytesseract.

    Parameters:
        image_path (str): Path to the image file.
        lang (str): Languages to use (default: 'heb+eng').

    Returns:
        str: Extracted text.
    """
    try:
        # פתיחת קובץ התמונה
        image = Image.open(image_path)
        # חילוץ טקסט
        text = pytesseract.image_to_string(image, lang=lang)
        return text
    except Exception as e:
        return f"Error: {e}"

# הדגמה עם קובץ תמונה
if __name__ == "__main__":
    # נתיב לתמונה
    image_path = "assets/IMG_5776.JPG"
    # חילוץ טקסט
    extracted_text = extract_text_from_image(image_path)
    # הדפסת התוצאה
    print("Extracted Text:")
    print(extracted_text)
