from django.http import JsonResponse
import json
from .services import predict_category


def classify_text_view(request):
    """
    Endpoint to classify text using the ML model.
    """
    if request.method == "POST":
        try:
            # Parse the JSON body
            data = json.loads(request.body)
            text = data.get("text", "")  # Get the 'text' field
            if not text:
                return JsonResponse({"error": "No text provided"}, status=400)

            # Predict the category using the ML model
            category = predict_category(text)
            return JsonResponse({"category": category}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)
