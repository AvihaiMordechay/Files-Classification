from django.http import JsonResponse
from django.middleware.csrf import get_token


def get_csrf_token_view(request):
    """
    View to provide CSRF Token for the client.
    """
    token = get_token(request)
    return JsonResponse({'csrfToken': token})
