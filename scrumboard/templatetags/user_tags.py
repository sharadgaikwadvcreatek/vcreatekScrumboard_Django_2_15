from __future__ import unicode_literals
from django import template
from datetime import datetime
from django.conf import settings
from django.shortcuts import render
from datetime import date
from django.contrib.humanize.templatetags.humanize import intcomma

from scrumboard.models import Projects, Team, ProjectType, Priority, ProjectStatus, TaskStatus, ProjectTimeline, ProjectTimeline, Level2, Task, TaskComment, UserTeam

register = template.Library()

@register.filter('days_until')
def days_until(date):    
    delta = datetime.now().date() - datetime.date(date)
    if delta.days > 0 and delta.days < 2:
    	datastring = str(delta.days)+" Day Ago"
    elif delta.days > 1 and delta.days <= 30:
    	datastring = str(delta.days)+" Days Ago"
    elif delta.days > 30:
        return datetime.strptime(str(date), "%Y-%m-%d %H:%M:%S.%f%z").strftime("%Y-%m-%d")
    else:
    	datastring="Today"
    return datastring

@register.filter('has_group')
def has_group(user, group_name):    
    groups = user.groups.all().values_list('name', flat=True)
    return True if group_name in groups else False

@register.filter('getDay')
def getDay(date):
    day = datetime.strptime(str(date), "%Y-%m-%d %H:%M:%S.%f%z").strftime("%a")
    return day.capitalize()

@register.filter('getDate')
def getDate(date):    
    new_date = datetime.strptime(str(date), "%Y-%m-%d %H:%M:%S.%f%z").strftime("%d")
    return new_date

@register.filter('getTeamMemberList')
def getTeamMemberList(team_id):
    teamMemberList = UserTeam.objects.filter(team_id=team_id)
    return teamMemberList

@register.filter('getRoleName')
def getRoleName(role):
    role_name = role.replace('_',' ')
    return role_name
    