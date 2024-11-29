from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse,  HttpResponseRedirect
from django.template import loader
from django.contrib.auth.models import User
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth import login, authenticate
from datetime import datetime
from django.core.paginator import EmptyPage, Paginator, PageNotAnInteger

from vcreatek.forms import ProjectsForm, TaskForm
from scrumboard.models import Projects, Team, ProjectType, Priority, ProjectStatus, TaskStatus, ProjectTimeline, ProjectTimeline, Level2, Task, TaskComment, UserTeam

def loginPage(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        team_ids = []

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            groups = request.user.groups.all().values_list('name', flat=True)
            request.session['role'] = groups[0]
            request.session.modified = True

            try:
                user_teams = UserTeam.objects.filter(user_id=user.id)
                for user_team in user_teams:
                    team_ids.append(user_team.team_id)
            except UserTeam.DoesNotExist:
                team_ids = []
            
            request.session['team_ids'] = team_ids
            request.session.modified = True

            return redirect('home')
        else:
            messages.error(
                request, 'Please enter a correct username and password. Note that both fields may be case-sensitive')

    return render(request, 'registration/login.html')

@login_required(login_url='/login/')
def custom_logout(request):
    if 'role' in request.session:
        del request.session['role']

    if 'team_ids' in request.session:
        del request.session['team_ids']
    request.session.modified = True

    logout(request)

    return redirect('login')

@login_required(login_url='/login/')
def set_layout_session(request):
    layout = request.POST.get('layout')
    if layout == 'light-layout':
        request.session['layout'] = 'dark-layout'
    else:
        request.session['layout'] = 'light-layout'
    request.session.modified = True
    return JsonResponse({'status':True})

@login_required(login_url='/login/')
def refresh_filter(request):
    if 'project_type_f' in request.session:
        del request.session['project_type_f']

    if 'priority_f' in request.session:
        del request.session['priority_f']

    if 'project_status_f' in request.session:
        del request.session['project_status_f']

    if 'level_2_f' in request.session:
        del request.session['level_2_f']

    if 'task_status_f' in request.session:
        del request.session['task_status_f']

    if 'priority_f' in request.session:
        del request.session['priority_f']

    request.session.modified = True

    # if request.headers.get('x-requested-with') == 'XMLHttpRequest':
    if request.is_ajax():
        return JsonResponse({'status': True})
    else:
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@login_required(login_url='/login/')
def dashboard(request):
    return render(request, 'dashboard.html')


@login_required(login_url='/login/')
def home(request):
    project_count = Projects.objects.filter(is_deleted=False, team_id__in=request.session['team_ids']).count()
    task_count = Task.objects.filter(is_deleted=False, project__team_id__in=request.session['team_ids']).count()

    t_completed_count = Task.objects.filter(is_deleted=False, progress_id=1, project__team_id__in=request.session['team_ids']).count()
    t_dependent_story_count = Task.objects.filter(is_deleted=False, progress_id=2,project__team_id__in=request.session['team_ids']).count()
    t_in_progress_watch_count = Task.objects.filter(is_deleted=False, progress_id=3,project__team_id__in=request.session['team_ids']).count()
    t_not_started_count = Task.objects.filter(is_deleted=False, progress_id=4,project__team_id__in=request.session['team_ids']).count()
    t_in_progress_on_track = Task.objects.filter(is_deleted=False, progress_id=5,project__team_id__in=request.session['team_ids']).count()
    t_at_risk = Task.objects.filter(is_deleted=False, progress_id=6,project__team_id__in=request.session['team_ids']).count()

    t_critical_priority = Task.objects.filter(is_deleted=False, priority_id=1,project__team_id__in=request.session['team_ids']).count()
    t_high_priority = Task.objects.filter(is_deleted=False, priority_id=2,project__team_id__in=request.session['team_ids']).count()
    t_medium_priority = Task.objects.filter(is_deleted=False, priority_id=3,project__team_id__in=request.session['team_ids']).count()
    t_low_priority = Task.objects.filter(is_deleted=False, priority_id=4,project__team_id__in=request.session['team_ids']).count()


    return render(request, 'home.html', {
        'project_count':project_count,
        'task_count':task_count,
        't_completed_count':t_completed_count,
        't_dependent_story_count':t_dependent_story_count,
        't_in_progress_watch_count':t_in_progress_watch_count,
        't_not_started_count':t_not_started_count,
        't_in_progress_on_track':t_in_progress_on_track,
        't_at_risk':t_at_risk,
        't_critical_priority':t_critical_priority,
        't_high_priority':t_high_priority,
        't_medium_priority':t_medium_priority,
        't_low_priority':t_low_priority,
    })

@login_required(login_url='/login/')
def projects(request, current_page=1, args=None):
    urs = []
    form = ProjectsForm()
    if request.method == 'POST':
        is_filter = request.POST.get('is_filter')
        if is_filter is not None:
            if request.POST.get('project_type_f'):
                request.session['project_type_f'] = request.POST.get('project_type_f')

            if request.POST.get('priority_f'):
                request.session['priority_f'] = request.POST.get('priority_f')

            if request.POST.get('project_status_f'):
                request.session['project_status_f'] = request.POST.get('project_status_f')
        else:
            project_id = request.POST.get('project_id')        
            if project_id != '':
                instance = Projects.objects.get(pk=project_id) 
                form = ProjectsForm(request.POST or None, instance=instance)
            else:
                form = ProjectsForm(request.POST)

            if form.is_valid():
                project = form.save()

                projectTimeline = ProjectTimeline()
                projectTimeline.project = project

                if project_id != '':
                    project.updated_by =  User.objects.get(pk=request.user.id)
                    projectTimeline.action = 'Project Updated'
                    projectTimeline.details = "Project updated by "+request.user.first_name+" "+request.user.last_name
                    messages.success(request, "Project updated successfully.")
                else:
                    project.created_by =  User.objects.get(pk=request.user.id)
                    project.status =  ProjectStatus.objects.get(id=1)
                    projectTimeline.action = 'Project Created'
                    projectTimeline.details =  "Project created by "+request.user.first_name+" "+request.user.last_name
                    messages.success(request, "Project added successfully.")
                projectTimeline.save()
                project.save()
                return redirect('projects')
            else:
                messages.error(request, "Form validation error. Please check form details.")

    projects = Projects.objects.filter(team_id__in=request.session['team_ids']).order_by('id')

    if 'project_type_f' in request.session:
        project_type_f_session_value = request.session['project_type_f']
        projects = projects.filter(project_type_id=project_type_f_session_value)

    if 'priority_f' in request.session:
        priority_f_session_value = request.session['priority_f']
        projects = projects.filter(priority_id=priority_f_session_value)

    if 'project_status_f' in request.session:
        project_status_f_session_value = request.session['project_status_f']
        projects = projects.filter(status=project_status_f_session_value)

    for ur in projects:
        data = ur.as_dictmain()
        urs.append(data)

    per_page = 8
    paginator = Paginator(urs, per_page=per_page)
    try:
        page = paginator.page(current_page)
    except PageNotAnInteger:
        current_page = 1
        page = paginator.page(current_page)
    except EmptyPage:
        current_page = paginator.num_pages
        page = paginator.page(current_page)
    current_page = int(current_page)
    idx = 1
    for r in page.object_list:
        r['idx'] = idx + per_page * (current_page - 1)
        idx = idx + 1

    levelTwos = Level2.objects.all()
    project_types = ProjectType.objects.all()
    project_statuses = ProjectStatus.objects.all()
    task_statuses = TaskStatus.objects.all()
    priorities = Priority.objects.all()
    teams = Team.objects.all()

    # if request.headers.get('x-requested-with') == 'XMLHttpRequest':
    if request.is_ajax():
        template = loader.get_template('search_projects.html')
        context = {
            'form' : form,
            'projects' : urs,
            'page_range': paginator.page_range,
            'page': page,
            'current_page': current_page,
            'max_page': paginator.num_pages,
            'levelTwos':levelTwos,
            'project_types' : project_types ,
            'priorities' : priorities ,
            'teams' : teams,
            'task_statuses':task_statuses,
            'project_statuses':project_statuses
        }
        return HttpResponse(template.render(context, request))
    else:
        return render(request, 'projects.html', {
            'form' : form,
            'projects' : urs,
            'page_range': paginator.page_range,
            'page': page,
            'current_page': current_page,
            'max_page': paginator.num_pages,
            'levelTwos':levelTwos,
            'project_types' : project_types ,
            'priorities' : priorities ,
            'teams' : teams,
            'task_statuses':task_statuses,
            'project_statuses':project_statuses
        })

@login_required(login_url='/login/')
def getProjectsList(request):
    try:
        urs = []        
        projects =  Projects.objects.filter(team_id__in=request.session['team_ids']).order_by('-id')
        for ur in projects:
            data = {}
            number_of_task = 0
            try:
                number_of_task = Task.objects.filter(is_deleted=False, project_id=ur.id).count()
            except Task.DoesNotExist:
                number_of_task = 0            
            data.update({'id': ur.id})
            data.update({'project_name': ur.project_name})
            data.update({'project_type': ur.project_type.type})
            data.update({'priority': ur.priority.id})
            data.update({'number_of_task': number_of_task})
            data.update({'start_date': ur.start_date})
            data.update({'due_date': ur.due_date})
            data.update({'finish_date': ur.finish_date})
            data.update({'team': ur.team.name})   
            data.update({'status': ur.status.id})           
            urs.append(data)
        if projects is not None:
            return JsonResponse({'data': urs})
        else:
            return JsonResponse(urs | safe)
    except Projects.DoesNotExist:
        return JsonResponse({'data': list()})


@login_required(login_url='/login/')
def getProjectsTaskList(request, project_id):
    try:
        urs = []
        
        tasks = Task.objects.filter(is_deleted=False, project_id=project_id).order_by('-id')

        for ur in tasks:
            allComment = ''
            comments = TaskComment.objects.filter(task=ur.id)
            for comment in comments:
                date = datetime.strptime(str(comment.created_on), "%Y-%m-%d %H:%M:%S.%f%z").strftime("%d %b %y")
                allComment = allComment + "["+date+"]: "+ " " +comment.comment+"<br>"               
            data = {}
            data.update({'id': ur.id})
            data.update({'project': ur.project.project_name})
            data.update({'level_2': ur.level_2.level_2})
            data.update({'level_3': ur.level_3})
            data.update({'progress': ur.progress.id})
            data.update({'priority': ur.priority.id})
            data.update({'request_date': ur.request_date})
            data.update({'start_date': ur.start_date})
            data.update({'due_date': ur.due_date})
            data.update({'finish_date': ur.finish_date})
            data.update({'assign_to': ur.assign_to.id})
            data.update({'approval': ur.approval})            
            data.update({'comment': allComment})
            data.update({'created_by': ur.created_by.id})
            urs.append(data)
        if projects is not None:
            return JsonResponse({'data': urs})
        else:
            return JsonResponse(urs | safe)
    except Projects.DoesNotExist:
        return JsonResponse({'data': list()})


@login_required(login_url='/login/')
def getProjectById(request):
    request_id = request.POST.get('id')
    try:
        project = Projects.objects.filter(is_deleted=False, pk=request_id).values('id', 'project_name', 'project_type', 'priority', 'request_date', 'start_date', 'due_date', 'finish_date', 'team')
        if project is not None:
            return JsonResponse({'data': list(project)})
        else:
            return JsonResponse({'data': list()})
    except Projects.DoesNotExist:
        return JsonResponse({'data': list()})

@login_required(login_url='/login/')
def getTaskById(request):
    request_id = request.POST.get('id')
    try:
        task = Task.objects.filter(is_deleted=False, pk=request_id).values('id','project_id', 'level_2', 'level_3', 'progress_id', 'priority_id', 'request_date', 'start_date', 'due_date', 'finish_date', 'assign_to_id')
        if task is not None:
            return JsonResponse({'data': list(task)})
        else:
            return JsonResponse({'data': list()})
    except Task.DoesNotExist:
        return JsonResponse({'data': list()})

@login_required(login_url='/login/')
def view(request, id, current_page=1, args=None):
    urs = []
    try:
        projectDetails = Projects.objects.get(pk=id)
    except Projects.DoesNotExist:
        return redirect('projects')
    
    if request.method == 'POST':
        if request.POST.get('level_2_f'):
            request.session['level_2_f'] = request.POST.get('level_2_f')

        if request.POST.get('task_status_f'):
            request.session['task_status_f'] = request.POST.get('task_status_f')

        if request.POST.get('priority_f'):
            request.session['priority_f'] = request.POST.get('priority_f')

    try:
        tasks = Task.objects.filter(is_deleted=False, project=id).order_by('id')
    except Task.DoesNotExist:
        return redirect('projects')

    if 'level_2_f' in request.session:
        level_2_f_session_value = request.session['level_2_f']
        tasks = tasks.filter(level_2_id=level_2_f_session_value)

    if 'task_status_f' in request.session:
        task_status_f_session_value = request.session['task_status_f']
        tasks = tasks.filter(progress_id=task_status_f_session_value)

    if 'priority_f' in request.session:
        priority_f_session_value = request.session['priority_f']
        tasks = tasks.filter(priority_id=priority_f_session_value)

    for ur in tasks:
        data = ur.as_dictmain()
        urs.append(data)

    per_page = 8
    paginator = Paginator(urs, per_page=per_page)
    try:
        page = paginator.page(current_page)
    except PageNotAnInteger:
        current_page = 1
        page = paginator.page(current_page)
    except EmptyPage:
        current_page = paginator.num_pages
        page = paginator.page(current_page)
    current_page = int(current_page)
    idx = 1
    for r in page.object_list:
        r['idx'] = idx + per_page * (current_page - 1)
        idx = idx + 1

    levelTwos = Level2.objects.all()
    task_statuses = TaskStatus.objects.all()
    priorities = Priority.objects.all()   

    try:
        projectTimelines = ProjectTimeline.objects.filter(project=id)
    except ProjectTimeline.DoesNotExist:
        projectTimelines = None

    
    # if request.headers.get('x-requested-with') == 'XMLHttpRequest':
    if request.is_ajax():
        template = loader.get_template('search_task.html')
        context = {
            'tasks':urs,
            'page_range': paginator.page_range,
            'page': page,
            'current_page': current_page,
            'max_page': paginator.num_pages,
            'levelTwos':levelTwos,
            'task_statuses':task_statuses,
            'priorities':priorities,
            'projectDetails':projectDetails,
            'projectTimelines':projectTimelines,
            'project_id':id
        }
        return HttpResponse(template.render(context, request))
    else:
        return render(request, 'view.html',{
            'tasks':urs,
            'page_range': paginator.page_range,
            'page': page,
            'current_page': current_page,
            'max_page': paginator.num_pages,
            'levelTwos':levelTwos,
            'task_statuses':task_statuses,
            'priorities':priorities,
            'projectDetails':projectDetails,
            'projectTimelines':projectTimelines,
            'project_id':id
        })

@login_required(login_url='/login/')
def add_task(request):
    if request.method == 'POST':
        task_id = request.POST.get('task_id')
        if task_id != '' and task_id is not None:
            instance = Task.objects.get(pk=task_id) 
            form = TaskForm(request.POST or None, instance=instance)
        else:
            form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save()
            if task_id != '' and task_id is not None:
                if task.progress_id == 1:
                    task.finish_date = datetime.now().strftime("%Y-%m-%d") 
                task.updated_by = User.objects.get(pk=request.user.id)
                task.save()
                messages.success(request, "Project Task updated successfully.")
            else:
                if request.session['role'] == 'developer':
                    task.approval= 1
                    task.assign_to= User.objects.get(pk=request.user.id)              
                else:
                    task.approval= 2
                    task.assign_to= User.objects.get(pk=request.POST.get('assign_to'))

                task.created_by= User.objects.get(pk=request.user.id)
                task.save()
                messages.success(request, "Project Task added successfully.")
            
            return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
        else:
            messages.error(request, "Form validation error. Please check form details.")
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@login_required(login_url='/login/')
def addTaskComments(request):
    task_id = request.POST.get('id')
    comment = request.POST.get('comment')
    try:
        taskComment = TaskComment()
        taskComment.task = Task.objects.get(pk=task_id)
        taskComment.comment = comment
        taskComment.save()
        return JsonResponse({'status':True})
    except TaskComment.DoesNotExist:
        return JsonResponse({'status':False})

@login_required(login_url='/login/')
def changeStatusOfTask(request):
    task_id = request.POST.get('id')
    progress = request.POST.get('progress')
    try:
        task = Task.objects.get(pk=task_id)
        task.progress = TaskStatus.objects.get(id=progress)
        task.save()
        return JsonResponse({'status':True})
    except Task.DoesNotExist:
        return JsonResponse({'status':False})


@login_required(login_url='/login/')
def delete_task(request):
    task_id = request.POST.get('id')
    try:
        task = Task.objects.get(pk=task_id)
        task.is_deleted = True
        task.save()
        return JsonResponse({'status':True})
    except Task.DoesNotExist:
        return JsonResponse({'status':False})

@login_required(login_url='/login/')
def approve_task(request):
    task_id = request.POST.get('id')
    try:
        task = Task.objects.get(pk=task_id)
        task.approval = 2
        task.save()
        return JsonResponse({'status':True})
    except Task.DoesNotExist:
        return JsonResponse({'status':False})

@login_required(login_url='/login/')
def getTeamMemberByTeamId(request):
    project_id = request.POST.get('id')
    print(project_id)
    try:
        try:
            project = Projects.objects.get(pk=project_id)
        except UserTeam.DoesNotExist:
            return JsonResponse({'data': list()})
        
        if project is not None:
            teamMemberList = UserTeam.objects.filter(team_id=project.team_id).values('user','user__first_name','user__last_name')
            print(teamMemberList)
            return JsonResponse({'data': list(teamMemberList)})
        else:
            return JsonResponse({'data': list()})

    except UserTeam.DoesNotExist:
        return JsonResponse({'data': list()})

@login_required(login_url='/login/')
def getTaskByIdView(request):
    request_id = request.POST.get('id')
    try:
        allComment = ''
        comments = TaskComment.objects.filter(task=request_id)
        for comment in comments:
            date = datetime.strptime(str(comment.created_on), "%Y-%m-%d %H:%M:%S.%f%z").strftime("%d %b %y")
            allComment = allComment + "["+date+"]: "+ " " +comment.comment+"<br>"  

        task = Task.objects.filter(is_deleted=False, pk=request_id).values('id','project_id', 'level_2__level_2', 'level_3', 'progress_id', 'priority_id', 'request_date', 'start_date', 'due_date', 'finish_date', 'assign_to_id', 'approval', 'created_by_id')
        if task is not None:
            return JsonResponse({'data': list(task),'comment':allComment})
        else:
            return JsonResponse({'data': list()})
    except Task.DoesNotExist:
        return JsonResponse({'data': list()})