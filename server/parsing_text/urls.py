from django.urls import path
from . import views

urlpatterns = [
    path('parse-text/', views.parse_text_view, name='parse_text'),
]
