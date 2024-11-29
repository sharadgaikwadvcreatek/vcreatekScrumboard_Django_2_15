(function (window, undefined) {
  'use strict';

  $(".card-view-button").click(function(){
    $(".list-view").hide();
    $(".card-view").show();
    $("#add_new_project_button").show();
    $("#add_new_task_button").show();
  });

  $(".list-view-button").click(function(){
    $(".card-view").hide();
    $(".list-view").show();
    $("#add_new_project_button").hide();
    $("#add_new_task_button").hide();
  });

  $('#project_type_f').on('select2:selecting', function(e) {
    var project_type_f = e.params.args.data.id;
    var is_filter = 1;
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    $.ajax({
        url: "/search_projects/",
        type: "post",
        data: {'is_filter':is_filter,'project_type_f':project_type_f, 'csrfmiddlewaretoken':csrftoken},
        success: function(response) 
        {
          $('#project_type_f').val(project_type_f);
          $('.add_here').html(response); 
          feather.replace({
              width: 14,
              height: 14
          });
        }
    });
  });

  $('#priority_f').on('select2:selecting', function(e) {
    var priority_f = e.params.args.data.id;
    var is_filter = 1;
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    $.ajax({
        url: "/search_projects/",
        type: "post",
        data: {'is_filter':is_filter,'priority_f':priority_f, 'csrfmiddlewaretoken':csrftoken},
        success: function(response) 
        {
          $('#priority_f').val(priority_f);
          $('.add_here').html(response); 
          feather.replace({
              width: 14,
              height: 14
          });
        }
    });
  });

  $('#project_status_f').on('select2:selecting', function(e) {
    var project_status_f = e.params.args.data.id;
    var is_filter = 1;
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    $.ajax({
        url: "/search_projects/",
        type: "post",
        data: {'is_filter':is_filter,'project_status_f':project_status_f, 'csrfmiddlewaretoken':csrftoken},
        success: function(response) 
        {
          $('#project_status_f').val(project_status_f);
          $('.add_here').html(response); 
          feather.replace({
              width: 14,
              height: 14
          });
        }
    });
  });

  $('#level_2_f').on('select2:selecting', function(e) {
    var project_id = $('#project_id').val();
    var level_2_f = e.params.args.data.id;
    var is_filter = 1;
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    $.ajax({
        url: "/search_task/"+project_id,
        type: "post",
        data: {'level_2_f':level_2_f, 'csrfmiddlewaretoken':csrftoken},
        success: function(response) 
        {
          $('#level_2_f').val(level_2_f);
          $('.add_here').html(response); 
          feather.replace({
              width: 14,
              height: 14
          });
        }
    });
  });

  $('#task_status_f').on('select2:selecting', function(e) {
    var project_id = $('#project_id').val();
    var task_status_f = e.params.args.data.id;
    var is_filter = 1;
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    $.ajax({
        url: "/search_task/"+project_id,
        type: "post",
        data: {'task_status_f':task_status_f, 'csrfmiddlewaretoken':csrftoken},
        success: function(response) 
        {
          $('#task_status_f').val(task_status_f);
          $('.add_here').html(response); 
          feather.replace({
              width: 14,
              height: 14
          });
        }
    });
  });

  $('#priority_f_v').on('select2:selecting', function(e) {
    var project_id = $('#project_id').val();
    var priority_f_v = e.params.args.data.id;
    var is_filter = 1;
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    $.ajax({
        url: "/search_task/"+project_id,
        type: "post",
        data: {'priority_f':priority_f_v, 'csrfmiddlewaretoken':csrftoken},
        success: function(response) 
        {
          $('#priority_f_v').val(priority_f_v);
          $('.add_here').html(response); 
          feather.replace({
              width: 14,
              height: 14
          });
        }
    });
  });

  $("#refresh_button").click(function(){
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    $.ajax({
        url: "/refresh_filter/",
        type: "post",
        data: {'csrfmiddlewaretoken':csrftoken},
        success: function(response) 
        {
            if (response.status) {
                window.location.reload();
            }
        }
    });
  });

})(window);

function editProject (id){
  var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
  $.ajax({
    url: "/getProjectById/",
    type: "post",
    data: {'id':id, 'csrfmiddlewaretoken':csrftoken},
    success: function(response) 
    {
      for (const [key, value] of Object.entries(response.data)) {
        $('#project_id').val(value.id);
        $('#project_name').val(value.project_name);
        $('#project_type').val(value.project_type).trigger('change');;      
        $('#priority').val(value.priority).trigger('change');;
        $('#request_date').val(value.request_date);
        $('#start_date').val(value.start_date);
        $('#due_date').val(value.due_date);
        $('#finish_date').val(value.finish_date);
        $('#team').val(value.team).trigger('change');
      }
      $('#modals-add-project').modal('show');
    }
  });  
}

function editTask (id){
  $('#model-view-task').modal('hide');
  var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
  $.ajax({
    url: "/getTaskById/",
    type: "post",
    data: {'id':id, 'csrfmiddlewaretoken':csrftoken},
    success: function(response) 
    {
      for (const [key, value] of Object.entries(response.data)) {
        $('#task_id').val(value.id);     
        $('#level_2').val(value.level_2).trigger('change');
        $('#level_3').val(value.level_3);
        $('#progress').val(value.progress_id).trigger('change');
        $('#task_priority').val(value.priority_id).trigger('change');
        $('#request_date').val(value.request_date);
        $('#start_date').val(value.start_date);
        $('#due_date').val(value.due_date);
        $('#finish_date').val(value.finish_date);
        $('#assign_to').val(value.assign_to_id).trigger('change');
      }
      $('#model-add-task').modal('show');
    }
  });  
}

function viewTask (id){
  $('#model-view-task').modal('hide');
  var user_role = $('#role').val();
  var user_id = $('#user_id').val();  
  var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
  $.ajax({
    url: "/getTaskByIdView/",
    type: "post",
    data: {'id':id, 'csrfmiddlewaretoken':csrftoken},
    success: function(response) 
    {
      for (const [key, value] of Object.entries(response.data)) {
        var $status_number = value.progress_id;
        var $status = {
          1: { title: 'Complete', class: 'bg-success' },
          2: { title: 'Dependent Story', class: 'bg-danger' },
          3: { title: 'In Progress-Watch', class: 'bg-warning' },
          4: { title: 'Not Started', class: 'bg-info' },
          5: { title: 'In Progress-On Track', class: 'bg-primary' },
          6: { title: 'At Risk', class: 'bg-danger' }
        };

        progress_status = '<span class="badge rounded-pill ' + $status[$status_number].class +'">' +$status[$status_number].title +'</span>'

        var $priority_number = value.priority_id;
        var $priority = {
          1: { title: 'Critical', class: 'badge-light-danger' },
          2: { title: 'High', class: ' badge-light-warning' },
          3: { title: 'Medium', class: ' badge-light-success' },
          4: { title: 'Low', class: ' badge-light-info' },
          5: { title: 'Not Assigned', class: ' badge-light-primary' },
        };

        priority_status = '<span class="badge rounded-pill ' + $priority[$priority_number].class + '">' +
        $priority[$priority_number].title + '</span>'

        $('.t_level_2').html(": "+value.level_2__level_2);
        $('.t_level_3').html(": "+value.level_3);
        $('.t_progress').html(": "+progress_status);
        $('.t_priority').html(": "+priority_status);
        $('.t_start_date').html(": "+value.start_date);
        $('.t_due_date').html(": "+value.due_date);
        if (value.finish_date){
          $('.t_finish_date').html(": "+value.finish_date);
        } else{
          $('.t_finish_date').html(": -");
        }
        
        $('.t_comment').html(": "+response.comment);
        var view_action = '<a href="javascript:;" class="item-edit mr-10" onclick="viewTask('+value.id+')"><i data-feather="eye"></i></a>';
        var edit_action = '<a href="javascript:;" class="item-edit mr-10" onclick="editTask('+value.id+')"><i data-feather="edit"></i></a>';
        var comment_action = '<a href="javascript:;" class="item-edit mr-10" onclick="addComment('+value.id+')"><i data-feather="message-circle"></i></a>';
        var change_status_action = '<a href="javascript:;" class="item-edit mr-10" onclick="changeStatus('+value.id+')"><i data-feather="toggle-right"></i></a>'
        var delete_action = '<a href="javascript:;" class="item-edit" onclick="deleteTask('+value.id+')"><i data-feather="trash"></i></a>'
        var approve_action = '<a href="javascript:;" class="item-edit" onclick="approveTask('+value.id+')"><i data-feather="check"></i></a>'
        if (value.approval == '2') {
          if (value.progress_id != '1') {
            if (value.created_by_id == user_id || user_role != 'developer'){
              $('.t_action').html(": "+view_action+edit_action+comment_action+change_status_action+delete_action);
            } else{
              $('.t_action').html(": "+view_action+comment_action+change_status_action);
            }
          } else{
            $('.t_action').html(": "+'');
          }
        } else{
          if (user_role != 'developer'){
            $('.t_action').html(": "+approve_action);
          }else{
            $('.t_action').html(": "+'Not Approved');
          }
        }
        
      }
      $('#model-view-task').modal('show');
      feather.replace({
        width: 14,
        height: 14
    });
    }
  });  
}

function addTask (id){
  $('#project').val(id);
  $('#model-view-task').modal('hide');
  var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
  $.ajax({
    url: "/getTeamMemberByTeamId/",
    type: "post",
    data: {'id':id, 'csrfmiddlewaretoken':csrftoken},
    success: function(response) 
    {
      for (const [key, value] of Object.entries(response.data)) {
        var html = '<option value=""></option>';
        for (const [key, value] of Object.entries(response.data)) {
          html= html+'<option value="'+value.user+'">'+value.user__first_name +" "+value.user__last_name+'</option> '
        }
        $('.assign_to').html(html);
        $('#assign_to').select2({
          placeholder: 'Select Team'
        });
      }
      $('#model-add-task').modal('show');
    }
  }); 

  $('#model-add-task').modal('show');
}

function addNewProject () {
  $('#project_id').val("");
  $('#project_name').val("");
  $('#project_type').val("").trigger('change');;      
  $('#priority').val("").trigger('change');;
  $('#request_date').val("");
  $('#start_date').val("");
  $('#due_date').val("");
  $('#finish_date').val("");
  $('#team').val("").trigger('change');
}

function addNewTask (){
  $('#model-view-task').modal('hide');
  $('#task_id').val("");      
  $('#level_2').val("").trigger('change');;
  $('#level_3').val("");
  $('#progress').val("").trigger('change');;
  $('#task_priority').val("").trigger('change');;
  $('#request_date').val("");
  $('#start_date').val("");
  $('#due_date').val("");
  $('#finish_date').val("");
  $('#assign_to').val("");
  $('#model-add-task').modal('show');
}

function addComment (id){
  $('#model-view-task').modal('hide');
  Swal.fire({
    input: 'textarea',
    title: 'To change status',
    text: "Please add comment here",
    type: 'warning',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Done',
    confirmButtonClass: 'btn btn-success',
    cancelButton: 'btn btn-primary ml-1',                        
    buttonsStyling: false,
    preConfirm: () => {
      if ($('.swal2-textarea').val()) {
      } else {
        Swal.showValidationMessage('Please add comment'); 
      }
    }
  }).then(function (result) {
    if (result.value) {
      var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
      $.ajax({
        url: "/addTaskComments/",
        type: "post",
        data: {'id':id, 'comment':result.value, 'csrfmiddlewaretoken':csrftoken},
        success: function(response) 
        {
          if (response.status) {
            Swal.fire(
            {
              icon: 'success',
              title: 'Completed',
              text: 'Comment has been added successfully.',
              confirmButtonClass: 'btn btn-success',
            }).then(function (result) {
              window.location.reload();
            });
          }else{
            Swal.fire(
            {
              icon: 'error',
              title: 'Not Added!',
              text: 'Something went wrong. Please try again later.',
              confirmButtonClass: 'btn btn-success',
            }).then(function (result) {
              window.location.reload();
            });
          }
        }
      });
    }
  })
}

function changeStatus (id){
  $('#model-view-task').modal('hide');
  Swal.fire({
    title: 'Change Progress',
    input: 'select',
    inputOptions: {
      '1': 'Complete',
      '2': 'Dependent Story',
      '3': 'In Progress-Watch',
      '4': 'Not Started',
      '5': 'In Progress-On Track',
      '6': 'At Risk'
    },
    inputPlaceholder: 'Please select progress.',
    showCancelButton: true,
    inputValidator: function (value) {
      return new Promise(function (resolve, reject) {
        if (value !== '') {
          resolve();
        } else {
          resolve('You need to select a progress');
        }
      });
    }
  }).then(function (result) {
    if (result.value) {
      var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
      $.ajax({
        url: "/changeStatusOfTask/",
        type: "post",
        data: {'id':id, 'progress':result.value, 'csrfmiddlewaretoken':csrftoken},
        success: function(response) 
        {
          if (response.status) {
            Swal.fire(
            {
              icon: 'success',
              title: 'Completed',
              text: 'Progress has change successfully.',
              confirmButtonClass: 'btn btn-success',
            }).then(function (result) {
              window.location.reload();
            });
          }else{
            Swal.fire(
            {
              icon: 'error',
              title: 'Not Added!',
              text: 'Something went wrong. Please try again later.',
              confirmButtonClass: 'btn btn-success',
            }).then(function (result) {
              window.location.reload();
            });
          }
        }
      });
    }
  })
}

function deleteTask (id){
  $('#model-view-task').modal('hide');
  Swal.fire({
    title: 'Are you sure!',
    text: "Do you want to delete this task?",
    type: 'warning',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    confirmButtonClass: 'btn btn-primary mr-10',
    cancelButtonClass: 'btn btn-danger',
    cancelButtonText: 'No',
    buttonsStyling: false,
  }).then(function (result) { 
      if (result.value) {
        var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
        $.ajax({
            url: "/delete_task/",
            type: "post",
            data: {'id':id, 'csrfmiddlewaretoken':csrftoken},
            success: function(response) 
            {
              if (response.status) {
                Swal.fire(
                {
                  icon: 'success',
                  title: 'Completed',
                  text: 'Task has been deleted successfully.',
                  confirmButtonClass: 'btn btn-success',
                }).then(function (result) {
                  window.location.reload();
                });
              }else{
                Swal.fire(
                {
                  icon: 'error',
                  title: 'Not deleted!',
                  text: 'Something went wrong. Please try again later.',
                  confirmButtonClass: 'btn btn-success',
                }).then(function (result) {
                  window.location.reload();
                });
              }
            }
        });              
      }
  });
}

function approveTask (id){
  $('#model-view-task').modal('hide');
  Swal.fire({
    title: 'Are you sure!',
    text: "Do you want to approve this task?",
    type: 'warning',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    confirmButtonClass: 'btn btn-primary mr-10',
    cancelButtonClass: 'btn btn-danger',
    cancelButtonText: 'No',
    buttonsStyling: false,
  }).then(function (result) { 
      if (result.value) {
        var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
        $.ajax({
            url: "/approve_task/",
            type: "post",
            data: {'id':id, 'csrfmiddlewaretoken':csrftoken},
            success: function(response) 
            {
              if (response.status) {
                Swal.fire(
                {
                  icon: 'success',
                  title: 'Completed',
                  text: 'Task has been approve successfully.',
                  confirmButtonClass: 'btn btn-success',
                }).then(function (result) {
                  window.location.reload();
                });
              }else{
                Swal.fire(
                {
                  icon: 'error',
                  title: 'Not Approve!',
                  text: 'Something went wrong. Please try again later.',
                  confirmButtonClass: 'btn btn-success',
                }).then(function (result) {
                  window.location.reload();
                });
              }
            }
        });              
      }
  });
}

var add_new_project = $('#add_new_project');
if (add_new_project.length) { 
  add_new_project.validate({
    rules: {
      'project_name': {
        required: true 
      },
      'project_type': {
        required: true 
      },
      'priority': {
        required: true 
      },
      'request_date': {
        required: true 
      },
      'start_date': {
        required: true 
      },
      'due_date': {
        required: true 
      },
      'team': {
        required: true 
      },
    }
  });
}

var add_new_task = $('#add_new_task');
if (add_new_task.length) { 
  add_new_task.validate({
    rules: {
      'level_2': {
        required: true 
      },
      'level_3': {
        required: true 
      },
      'progress': {
        required: true 
      },
      'priority': {
        required: true 
      },
      'request_date': {
        required: true 
      },
      'start_date': {
        required: true 
      },
      'due_date': {
        required: true 
      },
      'assign_to': {
        required: true 
      },
    }
  });
}

