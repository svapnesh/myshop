from django.urls import path, include

urlpatterns = [
    path('product/', include('productmgmt.api_urls')),
]
