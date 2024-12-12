from django.urls import path
from . import views

urlpatterns = [
    path('', views.process_file, name='process_file'),
]