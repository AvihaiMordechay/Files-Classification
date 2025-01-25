# import os
# from django.test import TestCase
# from .services import parse_text_from_image
# from dotenv import load_dotenv

# load_dotenv()


# class GoogleVisionRealImageTest(TestCase):

#     def test_parse_text_from_real_image(self):
#         """
#         Test parse_text_from_image with a real image file.`
#         """

#         file_path = "C:\\Users\\omerz\\OneDrive\\מסמכים\\Files-Classification\\python_parsing_text\\IMG_BF5C5404296B-1.jpeg"
#         if not os.path.exists(file_path):
#             self.fail(f"Test image not found at {file_path}")

#         try:
#             credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_PATH")
#             extracted_text = parse_text_from_image(file_path, credentials_path)

#             self.assertIsNotNone(extracted_text)
#             print(f"Extracted text: {extracted_text}")
#         except Exception as e:
#             self.fail(f"parse_text_from_image raised an exception: {e}")
