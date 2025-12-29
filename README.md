# MiyaleFilms Portfolio

## Purpose
A portfolio website for an event-focused photographer and filmmaker, showcasing:
- Weddings
- Birthdays and celebrations
- Political and public events

The site will be built as a full-stack project to support learning and future growth.

## Stack
### Backend
- Python (Django)
- Django REST Framework (API)
- Django Admin (content management)
- Pillow (image processing)
- django-cors-headers (frontend-to-API access in development)

### Frontend
- Next.js (React)
- Tailwind CSS

## Local Development Setup (Kali Linux)

### Prerequisites
- Python 3.x
- Node.js + npm
- Git

### Backend (Django)
From the repository root:

```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

## Frontend environment variables

Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000

