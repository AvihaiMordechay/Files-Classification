from django.urls import path
from . import views

urlpatterns = [
    path('parse/', views.parse_text_view, name='parse_text'),
    path('token/', views.get_csrf_token_view)
]
