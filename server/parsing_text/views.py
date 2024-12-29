from django.http import JsonResponse
from .services import parse_text_from_image
from dotenv import load_dotenv
import os

load_dotenv()


def parse_text_view(request):
    if request.method == "POST" and request.FILES.get("file"):
        file = request.FILES["file"]

        # Save the file temporarily
        file_path = f"/tmp/{file.name}"
        with open(file_path, "wb") as temp_file:
            for chunk in file.chunks():
                temp_file.write(chunk)

        try:
            # Get the credentials path from environment variables
            credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_PATH")
            if not credentials_path:
                return JsonResponse({"error": "Google credentials not set"}, status=500)

            # Extract text from image using Google Vision
            extracted_text = parse_text_from_image(file_path, credentials_path)
            return JsonResponse({"text": extracted_text}, status=200, json_dumps_params={'ensure_ascii': False})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)
