from django.urls import path
from .views import CategoryListAPIView, EventListAPIView, EventDetailAPIView, EnquiryCreateAPIView

urlpatterns = [
    path("categories/", CategoryListAPIView.as_view(), name="category-list"),
    path("events/", EventListAPIView.as_view(), name="event-list"),
    path("events/<slug:slug>/", EventDetailAPIView.as_view(), name="event-detail"),
    path("enquiries/", EnquiryCreateAPIView.as_view(), name="enquiry-create"),
]

