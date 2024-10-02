# Generated by Django 5.0.6 on 2024-07-12 17:57

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_rename_media_file_transcriptmodel_file'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transcriptmodel',
            name='transcript',
        ),
        migrations.AlterField(
            model_name='transcriptmodel',
            name='file',
            field=models.FileField(blank=True, null=True, upload_to=''),
        ),
        migrations.CreateModel(
            name='Utterance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('line', models.IntegerField()),
                ('speaker', models.CharField(max_length=1)),
                ('transcript', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='utterances', to='api.transcriptmodel')),
            ],
        ),
        migrations.CreateModel(
            name='Sentence',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sentence_number', models.IntegerField()),
                ('sentence', models.TextField()),
                ('tense', models.CharField(max_length=10)),
                ('utterance', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sentences', to='api.utterance')),
            ],
        ),
    ]
