from rest_framework import generics
from .models import Category, Event, Enquiry
from .serializers import CategorySerializer, EventListSerializer, EventDetailSerializer, EnquiryCreateSerializer


class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class EventListAPIView(generics.ListAPIView):
    serializer_class = EventListSerializer

    def get_queryset(self):
        qs = Event.objects.select_related("category").prefetch_related("media").all()

        category_slug = self.request.query_params.get("category")
        if category_slug:
            qs = qs.filter(category__slug=category_slug)

        featured = self.request.query_params.get("featured")
        if featured is not None:
            featured_val = featured.strip().lower() in {"1", "true", "yes", "y"}
            qs = qs.filter(featured=featured_val)

        return qs


class EventDetailAPIView(generics.RetrieveAPIView):
    queryset = Event.objects.select_related("category").prefetch_related("media").all()
    serializer_class = EventDetailSerializer
    lookup_field = "slug"


class EnquiryCreateAPIView(generics.CreateAPIView):
    queryset = Enquiry.objects.all()
    serializer_class = EnquiryCreateSerializer

