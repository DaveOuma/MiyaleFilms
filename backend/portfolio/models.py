from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=90, unique=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Event(models.Model):
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="events")
    title = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True, blank=True)
    date = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=160, blank=True)
    description = models.TextField(blank=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)
            slug = base
            i = 1
            while Event.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                i += 1
                slug = f"{base}-{i}"
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


def upload_to_event(instance, filename):
    return f"events/{instance.event.slug}/{filename}"


class MediaItem(models.Model):
    MEDIA_TYPE_CHOICES = [
        ("image", "Image"),
        ("video", "Video"),
    ]

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="media")
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES, default="image")
    file = models.FileField(upload_to=upload_to_event)
    caption = models.CharField(max_length=240, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_cover = models.BooleanField(default=False)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.event.title} ({self.media_type})"


class Enquiry(models.Model):
    EVENT_TYPE_CHOICES = [
        ("wedding", "Wedding"),
        ("birthday", "Birthday/Celebration"),
        ("public", "Political/Public Event"),
        ("other", "Other"),
    ]
    event = models.ForeignKey(
    "Event",
    null=True,
    blank=True,
    on_delete=models.SET_NULL,
    related_name="enquiries",
)


    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=40, blank=True)
    email = models.EmailField(blank=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES, default="other")
    event_date = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=160, blank=True)
    message = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.event_type}) - {self.created_at:%Y-%m-%d}"

