from django.urls import path, include
from rest_framework.routers import DefaultRouter

from api.views import TranscriptModelViewSet, TranscriptTimelineView, SentenceViewSet, SpeakerViewSet

router = DefaultRouter()
router.register(r'transcripts', TranscriptModelViewSet)
router.register(r'sentences', SentenceViewSet)
router.register(r'speakers', SpeakerViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('transcripts/<int:pk>', TranscriptTimelineView.as_view(), name='transcript-timeline'),
]