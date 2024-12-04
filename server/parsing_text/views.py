from django.http import JsonResponse
from .services import parse_text_from_image
from dotenv import load_dotenv
from django.middleware.csrf import get_token
import os

load_dotenv()


def get_csrf_token_view(request):
    """
    View to provide CSRF Token for the client.
    """
    token = get_token(request)
    return JsonResponse({'csrfToken': token})


def parse_text_view(request):
    print('test')
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
            print(extracted_text)
            return JsonResponse({"text": extracted_text}, status=200, json_dumps_params={'ensure_ascii': False})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)
