from google.cloud import vision
import os

# הגדרת המפתח של Google Cloud Vision API
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "finalproject-441315-f9731388604c.json"

# יצירת לקוח Vision API
client = vision.ImageAnnotatorClient()

# פתיחת התמונה שלך
with open("assets/IMG_5776.JPG", "rb") as image_file:
    content = image_file.read()

# יצירת אובייקט Image מהתמונה
image = vision.Image(content=content)

# שליחת הבקשה ל-API עם תמיכה בעברית ואנגלית
response = client.text_detection(
    image=image, image_context={"language_hints": ["he", "en"]}
)

# קבלת התוצאה
texts = response.text_annotations


# פונקציה לטיפול בטקסט הפוך (עברית)
def fix_hebrew_text(text):
    # הפוך מילים עבריות שמופיעות הפוך
    words = text.split()
    fixed_words = [
        word[::-1] if any(0x590 <= ord(c) <= 0x5FF for c in word) else word
        for word in words
    ]
    return " ".join(fixed_words)


# הדפסת הטקסט שזוהה
if texts:
    print("Detected text:")
    for text in texts:
        fixed_text = fix_hebrew_text(text.description)  # טיפול בעברית הפוכה
        print(f'\n"{fixed_text}"')
else:
    print("No text detected.")

# טיפול בשגיאות אם יש
if response.error.message:
    raise Exception(f"{response.error.message}")
