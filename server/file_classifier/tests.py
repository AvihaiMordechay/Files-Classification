import os
import unittest
from parsing_text.services import parse_text_from_image
from machine_learning.services import predict_category
from dotenv import load_dotenv
load_dotenv()

# Run with:  python -m unittest file_classifier.tests  , in the server folder

# Map Hebrew categories to English
CATEGORY_MAP = {
    'תחבורה': 'transportation',
    'רפואה': 'health',
    'פיננסי': 'finance',
    'השכלה':'education'
}


class FileClassifierTests(unittest.TestCase):
    
    def setUp(self):
        """
        Set up file paths and credentials.
        """
        self.high_quality_directory = r"C:\Omer_code\Files-Classification\file_classifier_assets\High quality"
        self.low_quality_directory = r"C:\Omer_code\Files-Classification\file_classifier_assets\Low quality"
        self.credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_PATH")
        print(self.credentials_path)
        if not self.credentials_path:
            raise EnvironmentError("Google credentials not set in environment variables.")
    
    def classify_file(self, file_path, credentials_path):
        """
        Process the file and return its classification.
        """
        try:
            # Extract text from the file
            extracted_text = parse_text_from_image(file_path, credentials_path)
            if not isinstance(extracted_text, str):
                raise ValueError(f"Failed to extract text from {file_path}")

            # Predict category
            predicted_category = predict_category(extracted_text)
            if not isinstance(predicted_category, str):
                raise ValueError(f"Failed to classify text from {file_path}")
            
            return predicted_category

        except Exception as e:
            print(f"An error occurred while processing {file_path}: {e}")
            return None
    
    def test_classify_file(self):
        """
        Test if file classification is correct for each file.
        """
        test_failed = False  # Tracks if any test failed
        all_tests_passed = True  # Tracks if all tests passed
        
        # Track results for each category
        category_results = {}

        # Process High Quality files
        print("\nTesting High Quality files:")
        for idx, file_name in enumerate(os.listdir(self.high_quality_directory), start=1):
            file_path = os.path.join(self.high_quality_directory, file_name)
            
            # Get predicted category
            predicted_category = self.classify_file(file_path, self.credentials_path)

            # Extract expected category from file name
            expected_category = None
            for category in category_results.keys():
                if category in file_name:
                    expected_category = category
                    break

            if predicted_category and predicted_category in file_name:
                # Print with English categories
                print(f"File {idx} classified correctly as '{CATEGORY_MAP.get(predicted_category, predicted_category)}'.")
                category_results[predicted_category] = category_results.get(predicted_category, {"passed": 0, "failed": 0})
                category_results[predicted_category]["passed"] += 1
            else:
                print(f"File {idx} was NOT classified correctly. Expected category in file name, but got '{CATEGORY_MAP.get(predicted_category, predicted_category)}'.")
                print(f"Error in file: {file_name}")
                test_failed = True
                all_tests_passed = False
                if expected_category:
                    category_results[expected_category] = category_results.get(expected_category, {"passed": 0, "failed": 0})
                    category_results[expected_category]["failed"] += 1

        # Process Low Quality files
        print("\nTesting Low Quality files:")
        for idx, file_name in enumerate(os.listdir(self.low_quality_directory), start=1):
            file_path = os.path.join(self.low_quality_directory, file_name)
            
            # Get predicted category
            predicted_category = self.classify_file(file_path, self.credentials_path)

            # Extract expected category from file name
            expected_category = None
            for category in category_results.keys():
                if category in file_name:
                    expected_category = category
                    break

            if predicted_category and predicted_category in file_name:
                # Print with English categories
                print(f"File {idx} classified correctly as '{CATEGORY_MAP.get(predicted_category, predicted_category)}'.")
                category_results[predicted_category] = category_results.get(predicted_category, {"passed": 0, "failed": 0})
                category_results[predicted_category]["passed"] += 1
            else:
                print(f"File {idx} was NOT classified correctly. Expected category in file name, but got '{CATEGORY_MAP.get(predicted_category, predicted_category)}'.")
                print(f"Error in file: {file_name}")
                test_failed = True
                all_tests_passed = False
                if expected_category:
                    category_results[expected_category] = category_results.get(expected_category, {"passed": 0, "failed": 0})
                    category_results[expected_category]["failed"] += 1

        # Print category-wise summary
        print("\nTest Summary:")
        total_passed = 0
        total_failed = 0
        for category, results in category_results.items():
            passed = results["passed"]
            failed = results["failed"]
            total_passed += passed
            total_failed += failed
            print(f"Category '{CATEGORY_MAP.get(category, category)}': Passed - {passed}, Failed - {failed}")

        print(f"\nTotal Tests: {total_passed + total_failed}")
        print(f"Total Passed: {total_passed}")
        print(f"Total Failed: {total_failed}")

        # Fail the test if any file was classified incorrectly
        if test_failed:
            self.fail("One or more files were not classified correctly.")

        # Print final test result
        if all_tests_passed:
            print("\nAll tests passed successfully!")
        else:
            print("\nSome tests failed.")


if __name__ == "__main__":
    unittest.main()
