from rest_framework import serializers
from .models import Category, Event, MediaItem, Enquiry
from cloudinary.utils import cloudinary_url


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "order"]


class MediaItemSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = MediaItem
        fields = ["id", "media_type", "file_url", "caption", "order", "is_cover"]

    def get_file_url(self, obj):
        request = self.context.get("request")
        if request is None:
            return obj.file.url
        return request.build_absolute_uri(obj.file.url)


class EventListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    cover = serializers.SerializerMethodField()
    has_video = serializers.BooleanField(read_only=True)

    class Meta:
        model = Event
        fields = ["id", "title", "slug", "date", "location", "featured", "category", "cover", "has_video"]

   

    def get_cover(self, obj):
        cover = obj.media.filter(is_cover=True).first() or obj.media.first()
        if not cover:
            return None

        resource_type = "video" if cover.media_type == "video" else "image"

        # cover.file is a CloudinaryField; cover.file.public_id is the reliable identifier
        public_id = getattr(cover.file, "public_id", None) or str(cover.file)

        url, _ = cloudinary_url(public_id, resource_type=resource_type, secure=True)

        return {"media_type": cover.media_type, "file_url": url, "caption": cover.caption}



class EventDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    media = MediaItemSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = ["id", "title", "slug", "date", "location", "description", "featured", "category", "media"]


class EnquiryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enquiry
        fields = ["id", "name", "phone", "email", "event_type", "event_date", "location", "message", "created_at"]
        read_only_fields = ["id", "created_at"]

