from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('parsing_text.urls')),
    path('model/', include('machine_learning.urls')),
    path('csrf/', include('csrf_handler.urls')),
]
