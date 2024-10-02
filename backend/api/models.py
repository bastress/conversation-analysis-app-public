from django.db import models


# Create your models here.
class TranscriptModel(models.Model):
    title = models.CharField(max_length=100, default="My Audio Transcript")
    file = models.FileField(upload_to='', null=True, blank=True)


class Speaker(models.Model):
    transcript = models.ForeignKey(TranscriptModel, related_name='speakers', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)


class Utterance(models.Model):
    transcript = models.ForeignKey(TranscriptModel, related_name='utterances', on_delete=models.CASCADE)
    speaker = models.ForeignKey(Speaker, related_name='utterances', on_delete=models.CASCADE)
    line = models.IntegerField()


class Sentence(models.Model):
    utterance = models.ForeignKey(Utterance, related_name='sentences', on_delete=models.CASCADE)
    sentence_number = models.IntegerField()
    sentence = models.TextField()
    tense = models.CharField(max_length=10)
    sentiment = models.CharField(max_length=10, default="NEUTRAL")
    start_time = models.FloatField(default=0)  # Start time in seconds
    end_time = models.FloatField(default=0)  # End time in seconds
