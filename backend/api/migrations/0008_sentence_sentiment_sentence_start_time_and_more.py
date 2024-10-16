# Generated by Django 5.0.6 on 2024-07-17 18:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_speaker_alter_utterance_speaker'),
    ]

    operations = [
        migrations.AddField(
            model_name='sentence',
            name='sentiment',
            field=models.CharField(default='NEUTRAL', max_length=10),
        ),
        migrations.AddField(
            model_name='sentence',
            name='start_time',
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name='sentence',
            name='stop_time',
            field=models.FloatField(default=0),
        ),
    ]
