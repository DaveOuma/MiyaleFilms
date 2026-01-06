from rest_framework import generics
from django.db.models import Exists, OuterRef
from .models import Category, Event, Enquiry, MediaItem
from .serializers import (
    CategorySerializer,
    EventListSerializer,
    EventDetailSerializer,
    EnquiryCreateSerializer,
)


class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class EventListAPIView(generics.ListAPIView):
    serializer_class = EventListSerializer

    def get_queryset(self):
        qs = (
            Event.objects.select_related("category")
            .prefetch_related("media")
            .all()
        )

        # annotate has_video (for EventCard overlay)
        video_qs = MediaItem.objects.filter(event=OuterRef("pk"), media_type="video")
        qs = qs.annotate(has_video=Exists(video_qs))

        # filter by category slug
        category_slug = self.request.query_params.get("category")
        if category_slug:
            qs = qs.filter(category__slug=category_slug)

        # filter by featured flag
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