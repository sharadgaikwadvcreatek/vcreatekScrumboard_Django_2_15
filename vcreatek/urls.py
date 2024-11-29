"""vcreatek URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from scrumboard import views
from django.contrib import admin

urlpatterns = [
    path('', views.home, name='home'),
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),
    path('login/', views.loginPage, name="login"),
    path('logout/', views.custom_logout, name="logout"),
    path('set_layout_session/', views.set_layout_session, name="set_layout_session"),
    path('refresh_filter/', views.refresh_filter, name="refresh_filter"),
    path('home/', views.home, name='home'),
    path('dashboard/', views.dashboard, name='dashboard'),

    path('projects/', views.projects, name='projects'),
    path('projects/<int:current_page>', views.projects, name='projects'),

    path('search_projects/', views.projects, name='search_projects'),
    path('search_projects/<int:current_page>', views.projects, name='search_projects'),

    path('getProjectsList/', views.getProjectsList, name='getProjectsList'),
    path('getProjectsTaskList/<int:project_id>', views.getProjectsTaskList, name='getProjectsTaskList'),
    path('getProjectById/', views.getProjectById, name='getProjectById'),

    path('view/<int:id>/', views.view, name='view'),
    path('view/<int:id>/<int:current_page>', views.view, name='view'),

    path('search_task/<int:id>', views.view, name='search_task'),
    path('search_task/<int:id>/<int:current_page>', views.view, name='search_task'),

    path('add_task/', views.add_task, name='add_task'),
    path('addTaskComments/', views.addTaskComments, name='addTaskComments'),  
    path('getTaskById/', views.getTaskById, name='getTaskById'),
    path('getTaskByIdView/', views.getTaskByIdView, name='getTaskByIdView'),
    path('changeStatusOfTask/', views.changeStatusOfTask, name='changeStatusOfTask'),
    path('delete_task/', views.delete_task, name='delete_task'),
    path('approve_task/', views.approve_task, name='approve_task'),
    path('getTeamMemberByTeamId/', views.getTeamMemberByTeamId, name='getTeamMemberByTeamId'),
]
