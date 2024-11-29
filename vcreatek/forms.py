from django import forms
from django.forms import ModelChoiceField
from django.contrib.auth.models import User

from scrumboard.models import (Projects, Team, ProjectType, Priority, ProjectStatus, TaskStatus, ProjectTimeline, ProjectTimeline, Level2, Task)

class ProjectsForm(forms.ModelForm):
    project_name = forms.CharField(required=True)
    project_type = ModelChoiceField(queryset=ProjectType.objects.all())
    priority = ModelChoiceField(queryset=Priority.objects.all())
    request_date = forms.CharField(required=True)
    start_date = forms.CharField(required=True)
    due_date = forms.CharField(required=True)
    team = ModelChoiceField(queryset=Team.objects.all())
    
    class Meta:
        model = Projects
        fields = ['project_name', 'project_type', 'priority', 'request_date', 'start_date', 'due_date', 'team']

class TaskForm(forms.ModelForm):
    project = ModelChoiceField(queryset=Projects.objects.all())
    level_2 = ModelChoiceField(queryset=Level2.objects.all())
    level_3 = forms.CharField(required=True)
    progress = ModelChoiceField(queryset=TaskStatus.objects.all())
    priority = ModelChoiceField(queryset=Priority.objects.all())
    request_date = forms.CharField(required=True)
    start_date = forms.CharField(required=True)
    due_date = forms.CharField(required=True)
    
    class Meta:
        model = Task
        fields = ['project', 'level_2', 'level_3', 'progress', 'priority', 'request_date', 'start_date', 'due_date']