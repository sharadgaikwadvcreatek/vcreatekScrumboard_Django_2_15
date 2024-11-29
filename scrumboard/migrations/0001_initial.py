# Generated by Django 4.2.3 on 2023-07-24 09:42

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Projects',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('project_name', models.CharField(blank=True, max_length=200, null=True)),
                ('project_type', models.CharField(blank=True, max_length=200, null=True)),
                ('priority', models.CharField(blank=True, max_length=200, null=True)),
                ('request_date', models.CharField(blank=True, max_length=200, null=True)),
                ('start_date', models.CharField(blank=True, max_length=200, null=True)),
                ('due_date', models.CharField(blank=True, max_length=200, null=True)),
                ('finish_date', models.CharField(blank=True, max_length=200, null=True)),
                ('team', models.CharField(blank=True, max_length=200, null=True)),
                ('is_deleted', models.BooleanField(default=0, null=True)),
                ('created_on', models.DateTimeField(auto_now=True, null=True)),
                ('updated_on', models.DateTimeField(auto_now=True, null=True)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='r_created_by', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='r_updated_by', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'projects',
            },
        ),
    ]
