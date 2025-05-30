from django.http import HttpResponse
from django.urls import path, include
from django.contrib import admin


def not_found_view(request):
    return HttpResponse("This page does not exist.", status=404)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('csrf/', include('csrf_handler.urls')),
    path('file_classifier/', include('file_classifier.urls')),
    # path('model/', include('machine_learning.urls')),
    path('', not_found_view),
]
