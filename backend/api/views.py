from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import TranscriptSerializer, TranscriptCreateSerializer, SpeakerSerializer, SentenceSerializer
from .models import TranscriptModel, Speaker, Utterance, Sentence

from pathlib import Path

import sys
sys.path.append('..')

from methods import generate_transcript, transcript_to_dict_object


class TranscriptModelViewSet(viewsets.ModelViewSet):
    queryset = TranscriptModel.objects.all()
    serializer_class = TranscriptSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return TranscriptCreateSerializer
        return TranscriptSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        main_data = serializer.save()

        file = main_data.file
        title = main_data.title

        transcript_data = self.process_file(file)
        utterances_data = transcript_data['utterances']
        speakers_data = transcript_data['speakers']

        # Create speakers
        speakers = {}
        for speaker_id, speaker_data in speakers_data.items():
            speaker, created = Speaker.objects.get_or_create(
                name=speaker_data['name'],
                transcript=main_data
            )
            speakers[speaker_id] = speaker

        # Create utterances and link speakers
        for utterance_data in utterances_data:
            speaker = speakers[utterance_data['speaker_id']]
            utterance = Utterance.objects.create(
                transcript=main_data,
                line=utterance_data['line'],
                speaker=speaker
            )
            sentences = [Sentence.objects.create(utterance=utterance, **sentence) for sentence in utterance_data['sentences']]
            utterance.sentences.set(sentences)

        response_serializer = TranscriptSerializer(main_data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def process_file(self, file):
        dict_object = transcript_to_dict_object(generate_transcript(file))
        return dict_object


class TranscriptTimelineView(APIView):
    def get(self, request, pk):
        try:
            transcript = TranscriptModel.objects.get(pk=pk)
        except TranscriptModel.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = TranscriptSerializer(transcript)
        return Response(serializer.data)


class SentenceViewSet(viewsets.ModelViewSet):
    queryset = Sentence.objects.all()
    serializer_class = SentenceSerializer


class SpeakerViewSet(viewsets.ModelViewSet):
    queryset = Speaker.objects.all()
    serializer_class = SpeakerSerializer

    @action(detail=True, methods=['patch'])
    def update_name(self, request, pk=None):
        speaker = self.get_object()
        new_name = request.data.get('name')
        if new_name:
            speaker.name = new_name
            speaker.save()
            return Response({'status': 'name updated'}, status=status.HTTP_200_OK)
        return Response({'status': 'name not provided'}, status=status.HTTP_400_BAD_REQUEST)