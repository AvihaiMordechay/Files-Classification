import os
import unittest
from parsing_text.services import parse_text_from_image
from machine_learning.services import predict_category


class FileClassifierTests(unittest.TestCase):
    
    def setUp(self):
        """
        הגדרת הנתיב המלא לקובץ והגדרת נתיב credentials.
        """
        self.file_directory = r"C:\Omer_code\Files-Classification\file_classifier_assets\High quality"
        self.credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_PATH")
        if not self.credentials_path:
            raise EnvironmentError("Google credentials not set in environment variables.")
    
    def classify_file(self, file_path, credentials_path):
        """
        פונקציה שמבצעת את עיבוד הקובץ ומחזירה את הסיווג.
        """
        try:
            # ניתוח הטקסט מתוך הקובץ
            extracted_text = parse_text_from_image(file_path, credentials_path)
            if not isinstance(extracted_text, str):
                raise ValueError(f"Failed to extract text from {file_path}")

            # סיווג הטקסט
            predicted_category = predict_category(extracted_text)
            if not isinstance(predicted_category, str):
                raise ValueError(f"Failed to classify text from {file_path}")
            
            return predicted_category

        except Exception as e:
            print(f"An error occurred while processing {file_path}: {e}")
            return None
    
    def test_classify_file_financial_category(self):
        """
        בדיקה אם הסיווג שהתקבל הוא כפי הצפוי עבור כל קובץ.
        """
        files_and_expected_categories = {
            "אי הגשת תביעה.pdf": "תחבורה",
            "בקשה לחידוש רישיון איכות גבוהה.jpg": "תחבורה",
            "העברת זהב 12-01-2021.pdf": "פיננסי",
            "הצהרת בריאות 2.pdf": "רפואה",
            "טופס הודעה על תאונה.pdf": "תחבורה",
            "ערבות בנקאית סרוק איכות גבוהה תמונה.jpg": "פיננסי",
            "רישיון נהיגה סרוק איכות גבוהה.jpg": "תחבורה",
            "רישיון רכב.pdf": "תחבורה",
            "שטר ערבות.pdf": "פיננסי"
        }

        # לולאה על הקבצים והקטגוריות
        for idx, (file_name, expected_category) in enumerate(files_and_expected_categories.items(), start=1):
            file_path = os.path.join(self.file_directory, file_name)
            predicted_category = self.classify_file(file_path, self.credentials_path)
            
            # השוואת הקטגוריה המנובאת לצפוי
            self.assertEqual(predicted_category, expected_category, f"Expected '{expected_category}', but got '{predicted_category}' for {file_name}")
            
            # הדפסת הודעה עם מספר סידורי
            if predicted_category == expected_category:
                print(f"File number {idx} was classified correctly as '{predicted_category}'.")
            else:
                print(f"File number {idx} was NOT classified correctly. Expected '{expected_category}', but got '{predicted_category}'.")


if __name__ == "__main__":
    unittest.main()
