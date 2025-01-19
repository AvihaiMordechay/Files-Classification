import os
import unittest
from parsing_text.services import parse_text_from_image
from machine_learning.services import predict_category


class FileClassifierTests(unittest.TestCase):
    
    def setUp(self):
        """
        הגדרת הנתיב המלא לקובץ והגדרת נתיב credentials.
        """
        self.high_quality_directory = r"C:\Omer_code\Files-Classification\file_classifier_assets\High quality"
        self.low_quality_directory = r"C:\Omer_code\Files-Classification\file_classifier_assets\Low quality"
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
    
    def test_classify_file(self):
        """
        בדיקה אם הסיווג שהתקבל הוא כפי הצפוי עבור כל קובץ.
        """
        test_failed = False  # משתנה שיבדוק אם היה כישלון
        all_tests_passed = True  # משתנה שיבדוק אם כל הבדיקות עברו

        # לולאה על כל הקבצים בתיקיית High quality
        print("\nTesting High Quality files:")
        for idx, file_name in enumerate(os.listdir(self.high_quality_directory), start=1):
            file_path = os.path.join(self.high_quality_directory, file_name)
            
            # סיווג הקובץ
            predicted_category = self.classify_file(file_path, self.credentials_path)
                
            # בדיקה אם הסיווג המנובא נמצא בשם הקובץ
            if predicted_category and predicted_category in file_name:
                print(f"File number {idx} was classified correctly as '{predicted_category}'.")
            else:
                print(f"File number {idx} was NOT classified correctly. Expected category in file name, but got '{predicted_category}'.")
                print(f"Error in file: {file_name}")  # הדפסת שם הקובץ שנכשל
                test_failed = True  # אם יש כישלון, נעדכן את המשתנה
                all_tests_passed = False  # סימון שהיו טעויות בבדיקות

        # לולאה על כל הקבצים בתיקיית Low quality
        print("\nTesting Low Quality files:")
        for idx, file_name in enumerate(os.listdir(self.low_quality_directory), start=1):
            file_path = os.path.join(self.low_quality_directory, file_name)
            
            # סיווג הקובץ
            predicted_category = self.classify_file(file_path, self.credentials_path)
                
            # בדיקה אם הסיווג המנובא נמצא בשם הקובץ
            if predicted_category and predicted_category in file_name:
                print(f"File number {idx} was classified correctly as '{predicted_category}'.")
            else:
                print(f"File number {idx} was NOT classified correctly. Expected category in file name, but got '{predicted_category}'.")
                print(f"Error in file: {file_name}")  # הדפסת שם הקובץ שנכשל
                test_failed = True  # אם יש כישלון, נעדכן את המשתנה
                all_tests_passed = False  # סימון שהיו טעויות בבדיקות

        # אם היה כישלון, נגרום לטסט להיכשל
        if test_failed:
            self.fail("One or more files were not classified correctly.")

        # הדפסת סיכום אם כל הבדיקות עברו
        if all_tests_passed:
            print("\nAll tests passed successfully!")
        else:
            print("\nSome tests failed.")

if __name__ == "__main__":
    unittest.main()
