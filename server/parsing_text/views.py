from django.http import JsonResponse
from .services import parse_text_from_image


def parse_text_view(request):
    if request.method == "POST" and request.FILES.get("file"):
        file = request.FILES["file"]

        # Save the file temporarily
        file_path = f"/tmp/{file.name}"
        with open(file_path, "wb") as temp_file:
            for chunk in file.chunks():
                temp_file.write(chunk)

        try:
            project_id = "your-gcp-project-id"
            secret_name = "google-vision-key"
            extracted_text = parse_text_from_image(
                file_path, project_id, secret_name)
            return JsonResponse({"text": extracted_text}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)
