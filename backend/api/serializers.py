from rest_framework import serializers

from .models import TranscriptModel, Speaker, Utterance, Sentence


class SentenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sentence
        fields = ['id', 'sentence_number', 'sentence', 'tense', 'sentiment', 'start_time', 'end_time']


class SpeakerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Speaker
        fields = ['id', 'name']


class UtteranceSerializer(serializers.ModelSerializer):
    sentences = SentenceSerializer(many=True)
    speaker = serializers.PrimaryKeyRelatedField(queryset=Speaker.objects.all())

    class Meta:
        model = Utterance
        fields = ['line', 'speaker', 'sentences']


class TranscriptSerializer(serializers.ModelSerializer):
    utterances = UtteranceSerializer(many=True)
    speakers = serializers.SerializerMethodField()

    class Meta:
        model = TranscriptModel
        fields = ['id', 'title', 'file', 'utterances', 'speakers']

    def get_speakers(self, obj):
        speakers = obj.speakers.all()
        return {speaker.id: {'name': speaker.name} for speaker in speakers}


class TranscriptCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TranscriptModel
        fields = ['title', 'file']
