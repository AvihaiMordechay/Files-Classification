from django.http import JsonResponse
from dotenv import load_dotenv
import os
from parsing_text.services import parse_text_from_image
from machine_learning.services import predict_category
from django.views.decorators.csrf import csrf_exempt

load_dotenv()


@csrf_exempt
def process_file(request):
    MIN_TEXT_LENGTH = 35
    if request.method == "POST":
        try:
            # return JsonResponse(
            #         {"category": "פיננסי", "message": "Text extracted and categorized successfully."},
            #         status=200,
            # )
            file = request.FILES.get("file")

            if not file:
                return JsonResponse(
                    {"error": "No file provided", "message": "No file was included in the request."},
                    status=400,
                )

            credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_PATH")

            if not credentials_path:
                return JsonResponse(
                    {"error": "Google credentials not set", "message": "Google credentials path is missing or incorrect."},
                    status=500,
                )

            # Create temporary directory if it doesn't exist
            import tempfile
            temp_dir = tempfile.gettempdir()
            file_path = os.path.join(temp_dir, file.name)

            with open(file_path, "wb+") as temp_file:
                for chunk in file.chunks():
                    temp_file.write(chunk)

            try:
                extracted_text = parse_text_from_image(file_path, credentials_path)

                if len(extracted_text.strip()) < MIN_TEXT_LENGTH:
                    category = "undefined"
                    message = "Text extracted successfully, but it's too short to classify reliably."
                else:
                    predicted_category = predict_category(extracted_text)
                    if predicted_category == "אחר":
                        category = "undefined"
                        message = "Text extracted, but couldn't be confidently categorized."
                    else:
                        category = predicted_category
                        message = "Text extracted and categorized successfully."

                return JsonResponse(
                    {
                        "category": category,
                        "message": message,
                        "text": extracted_text,
                    },
                    status=200,
                )

            except Exception as processing_error:
                print(f"Error during processing: {str(processing_error)}")
                return JsonResponse(
                    {"error": str(processing_error), "message": "An error occurred while processing the file."},
                    status=500,
                )

            finally:
                if os.path.exists(file_path):
                    try:
                        os.remove(file_path)
                    except Exception as cleanup_error:
                        print(f"Error removing temporary file: {str(cleanup_error)}")
                        return JsonResponse(
                            {"error": str(cleanup_error), "message": "Error removing temporary file."},
                            status=500,
                        )

        except Exception as e:
            return JsonResponse(
                {"error": str(e), "message": "An unexpected error occurred."},
                status=500,
            )

    return JsonResponse(
        {"error": "Invalid request method", "message": "Only POST requests are allowed."},
        status=405,
    )
