# API Plan (Django REST Framework)

## Data Model (initial)
- Category: weddings, birthdays, political/public, other
- Event: title, date, location, description, featured
- MediaItem: image/video file, caption, ordering, cover flag

## Endpoints (initial)
- GET /api/categories/
- GET /api/events/?category=<slug>
- GET /api/events/<slug>/
- GET /api/events/<slug>/media/

## Development Notes
- CORS is enabled to allow the Next.js frontend (localhost:3000) to call the API during development.
- Django Admin is used for content management initially.

