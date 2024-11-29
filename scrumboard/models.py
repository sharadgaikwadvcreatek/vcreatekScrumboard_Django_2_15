from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

DATE_FORMAT = '%d, %b %Y, %I:%M %p'
DATE_FORMAT_YMD = '%d, %b %Y'
TIME_FORMAT = '%I:%M %p'

class Team(models.Model):
    name = models.CharField(max_length=200)

    class Meta:
        db_table = "teams"
    
    def __str__(self):
        return self.name

    def as_dictmain(self):
        result = {}
        result['name'] = self.name        
        return result

class ProjectType(models.Model):
    type = models.CharField(max_length=200)

    class Meta:
        db_table = "project_types"
    
    def __str__(self):
        return self.type

    def as_dictmain(self):
        result = {}
        result['type'] = self.type        
        return result

class Priority(models.Model):
    priority = models.CharField(max_length=200)

    class Meta:
        db_table = "priorities"
    
    def __str__(self):
        return self.priority

    def as_dictmain(self):
        result = {}
        result['priority'] = self.priority        
        return result

class TaskStatus(models.Model):
    status = models.CharField(max_length=200)

    class Meta:
        db_table = "task_status"
    
    def __str__(self):
        return self.status

    def as_dictmain(self):
        result = {}
        result['status'] = self.status        
        return result

class ProjectStatus(models.Model):
    status = models.CharField(max_length=200)

    class Meta:
        db_table = "project_status"
    
    def __str__(self):
        return self.status

    def as_dictmain(self):
        result = {}
        result['status'] = self.status        
        return result

class Level2(models.Model):
    level_2 = models.CharField(max_length=200)

    class Meta:
        db_table = "level_2"
    
    def __str__(self):
        return self.level_2

    def as_dictmain(self):
        result = {}
        result['level_2'] = self.level_2        
        return result

class Projects(models.Model):
    project_name = models.CharField(max_length=200, null=True, blank=True)
    project_type = models.ForeignKey(ProjectType,null=True,on_delete=models.SET_NULL)
    priority = models.ForeignKey(Priority,null=True,on_delete=models.SET_NULL)
    request_date = models.CharField(max_length=200, null=True, blank=True)
    start_date = models.CharField(max_length=200, null=True, blank=True)
    due_date = models.CharField(max_length=200, null=True, blank=True)
    finish_date = models.CharField(max_length=200, null=True, blank=True)
    team = models.ForeignKey(Team,null=True,on_delete=models.SET_NULL)
    status = models.ForeignKey(ProjectStatus,null=True,on_delete=models.SET_NULL)
    is_deleted = models.BooleanField(null=True, default=0)
    created_on = models.DateTimeField(auto_now=True, null=True, blank=True)
    created_by = models.ForeignKey(User, null=True, related_name='r_created_by', on_delete=models.SET_NULL)
    updated_on = models.DateTimeField(auto_now=True, null=True, blank=True)
    updated_by = models.ForeignKey(User, null=True, related_name='r_updated_by', on_delete=models.SET_NULL) 

    class Meta:
        db_table = "projects"
    
    def __str__(self):
        return self.project_name

    def as_dictmain(self):
        result = {}
        result['id'] = self.id
        result['project_name'] = self.project_name
        result['project_type'] = self.project_type
        result['priority'] = self.priority
        result['request_date'] = self.request_date
        result['start_date'] = self.start_date
        result['due_date'] = self.due_date
        result['finish_date'] = self.finish_date
        result['team'] = self.team
        result['status'] = self.status
        result['is_deleted'] = self.is_deleted
        result['created_on'] = self.created_on
        result['created_by'] = self.created_by
        result['updated_on'] = self.updated_on
        result['updated_by'] = self.updated_by   
        return result

class Task(models.Model):
    project = models.ForeignKey(Projects,null=True,on_delete=models.SET_NULL)
    level_2 = models.ForeignKey(Level2,null=True,on_delete=models.SET_NULL)
    level_3 = models.CharField(max_length=200, null=True, blank=True)
    progress = models.ForeignKey(TaskStatus,null=True,on_delete=models.SET_NULL)
    priority = models.ForeignKey(Priority,null=True,on_delete=models.SET_NULL)
    request_date = models.CharField(max_length=200, null=True, blank=True)
    start_date = models.CharField(max_length=200, null=True, blank=True)
    due_date = models.CharField(max_length=200, null=True, blank=True)
    finish_date = models.CharField(max_length=200, null=True, blank=True)
    assign_to = models.ForeignKey(User, null=True, related_name='assign_to', on_delete=models.SET_NULL)
    approval = models.CharField(max_length=200, null=True, blank=True)
    is_deleted = models.BooleanField(null=True, default=0)
    created_on = models.DateTimeField(auto_now=True, null=True, blank=True)
    created_by = models.ForeignKey(User, null=True, related_name='t_created_by', on_delete=models.SET_NULL)
    updated_on = models.DateTimeField(auto_now=True, null=True, blank=True)
    updated_by = models.ForeignKey(User, null=True, related_name='t_updated_by', on_delete=models.SET_NULL) 

    class Meta:
        db_table = "tasks"
    
    def __str__(self):
        return self.level_2.level_2

    def as_dictmain(self):
        result = {}
        result['id'] = self.id
        result['project'] = self.project
        result['level_2'] = self.level_2
        result['level_3'] = self.level_3
        result['progress'] = self.progress
        result['priority'] = self.priority
        result['request_date'] = self.request_date
        result['start_date'] = self.start_date
        result['due_date'] = self.due_date
        result['finish_date'] = self.finish_date
        result['assign_to'] = self.assign_to
        result['is_deleted'] = self.is_deleted
        result['created_on'] = self.created_on
        result['created_by'] = self.created_by
        result['updated_on'] = self.updated_on
        result['updated_by'] = self.updated_by   
        return result

class ProjectTimeline(models.Model):
    project = models.ForeignKey(Projects,null=True,on_delete=models.SET_NULL)
    action = models.TextField(null=True)
    details = models.TextField(null=True)
    created_on = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        db_table = "project_timelines"
    
    def __str__(self):
        return self.project

    def as_dictmain(self):
        result = {}
        result['project'] = self.project
        result['action'] = self.action
        result['details'] = self.details
        result['updated_on'] = self.updated_on
        return result

class TaskComment(models.Model):
    task = models.ForeignKey(Task,null=True,on_delete=models.SET_NULL)
    comment = models.TextField(null=True)
    created_on = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        db_table = "task_comments"
    
    def __str__(self):
        return self.comment

    def as_dictmain(self):
        result = {}
        result['task'] = self.task
        result['comment'] = self.comment
        result['created_on'] = self.created_on
        return result

class UserTeam(models.Model):
    user = models.ForeignKey(User, null=True, related_name='user_team', on_delete=models.SET_NULL)
    team = models.ForeignKey(Team,null=True,on_delete=models.SET_NULL)
    created_on = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        db_table = "user_teams"
    
    def __str__(self):
        return self.user.first_name +' '+self.user.last_name

    def as_dictmain(self):
        result = {}
        result['user'] = self.user
        result['team'] = self.team
        result['created_on'] = self.created_on
        return result