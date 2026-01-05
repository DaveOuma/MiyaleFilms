from django.contrib import admin
from .models import Category, Event, MediaItem, Enquiry


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "order")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("order", "name")


class MediaItemInline(admin.TabularInline):
    model = MediaItem
    extra = 0


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "date", "location", "featured", "created_at")
    list_filter = ("category", "featured")
    search_fields = ("title", "location")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [MediaItemInline]


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "event_type", "event_date", "location", "is_read", "created_at")
    list_filter = ("event_type", "is_read")
    search_fields = ("name", "phone", "email", "location", "message")

