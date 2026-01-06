from django.contrib import admin
from .models import Category, Event, MediaItem, Enquiry


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "order")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("order", "name")
    search_fields = ("name",)


class MediaItemInline(admin.TabularInline):
    model = MediaItem
    extra = 0
    fields = ("media_type", "file", "caption", "order", "is_cover")
    ordering = ("order", "id")


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "date", "featured", "created_at")
    list_filter = ("featured", "category")
    search_fields = ("title", "location")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [MediaItemInline]
    ordering = ("-date", "-created_at")


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "event_type", "event_date", "location", "is_read", "created_at")
    list_filter = ("event_type", "is_read", "created_at")
    search_fields = ("name", "phone", "email", "location", "message")
    ordering = ("-created_at",)
    actions = ["mark_read"]

    @admin.action(description="Mark selected enquiries as read")
    def mark_read(self, request, queryset):
        queryset.update(is_read=True)