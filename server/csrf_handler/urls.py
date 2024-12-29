from django.urls import path
from .views import get_csrf_token_view

urlpatterns = [
    path('get-token/', get_csrf_token_view, name='get_csrf_token'),
]
