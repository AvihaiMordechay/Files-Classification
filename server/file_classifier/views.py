from django.http import JsonResponse
from dotenv import load_dotenv
import os
from parsing_text.services import parse_text_from_image
from machine_learning.services import predict_category
# from django.views.decorators.csrf import csrf_exempt

load_dotenv()


# @csrf_exempt
def process_file(request):
    if request.method == "POST":
        try:
            # שליפת הקובץ מתוך הבקשה
            file = request.FILES.get("file")
            if not file:
                return JsonResponse({"error": "No file provided"}, status=400)

            # שליפת נתיב האישורים ממשתני הסביבה
            credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_PATH")
            if not credentials_path:
                return JsonResponse({"error": "Google credentials not set"}, status=500)

            # שמירת הקובץ הזמני - גרסת ווינדוס
            # extracted_text = parse_text_from_image(
            #     file_path=file.temporary_file_path(),
            #     credentials_path=credentials_path
            # )

            # שמירת הקובץ הזמני - גרסת מק
            file_path = f"/tmp/{file.name}"
            with open(file_path, "wb") as temp_file:
                for chunk in file.chunks():
                    temp_file.write(chunk)

            try:
                # ניתוח הטקסט של הקובץ
                extracted_text = parse_text_from_image(
                    file_path, credentials_path)

                # סיווג הטקסט לקטגוריה
                category = predict_category(extracted_text)

                return JsonResponse({"category": category}, status=200)

            finally:
                # מחיקת הקובץ הזמני
                if os.path.exists(file_path):
                    os.remove(file_path)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)
