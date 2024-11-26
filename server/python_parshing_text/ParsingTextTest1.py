import pytesseract
from PIL import Image, ImageEnhance
import cv2

# טוען את התמונה
image_path = "assets/IMG_5776.JPG"  # כאן תכניס את הנתיב שלך לתמונה
image = cv2.imread(image_path)

# 1. המרת התמונה לשחור-לבן (Gray Scale)
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# 2. הסרת רעש מהתמונה באמצעות GaussianBlur
blurred = cv2.GaussianBlur(gray, (5, 5), 0)

# 3. הגברת קונטרסט (Thresholding)
_, thresh = cv2.threshold(blurred, 150, 255, cv2.THRESH_BINARY)

# 4. שיפור בהירות התמונה (אם צריך)
pil_image = Image.fromarray(thresh)
enhancer = ImageEnhance.Brightness(pil_image)
bright_image = enhancer.enhance(2)  # 1 הוא ברירת המחדל, 2 מגביר את הבהירות

# 5. קריאה עם pytesseract על התמונה המעובדת
text = pytesseract.image_to_string(bright_image, lang="heb+eng")  # עברית ואנגלית

# הצגת התוצאה
print(text)
