# Generated by Django 5.0.9 on 2024-10-02 20:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_pause_before_text_alter_sentence_sentence'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Pause',
        ),
    ]