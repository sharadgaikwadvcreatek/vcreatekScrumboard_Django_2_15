# Generated by Django 4.2.3 on 2023-07-31 10:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scrumboard', '0004_projecttimeline'),
    ]

    operations = [
        migrations.AddField(
            model_name='projecttimeline',
            name='created_on',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
        migrations.AddField(
            model_name='projecttimeline',
            name='details',
            field=models.TextField(null=True),
        ),
    ]
