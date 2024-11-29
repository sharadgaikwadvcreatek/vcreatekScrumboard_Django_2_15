/**
 * DataTables Basic
 */

$(function () {
  'use strict';

  var dt_basic_table1 = $('.datatables-basic'),
  dt_basic_table_task = $('.dt_basic_table_task'),
    dt_date_table = $('.dt-date'),
    dt_complex_header_table = $('.dt-complex-header'),
    dt_row_grouping_table = $('.dt-row-grouping'),
    dt_multilingual_table = $('.dt-multilingual'),
    assetPath = '/static/app-assets/';

  if ($('body').attr('data-framework') === 'laravel') {
    assetPath = $('body').attr('data-asset-path');
  }

  // DataTable with buttons
  // --------------------------------------------------------------------

  if (dt_basic_table1.length) {
    var user_role = $('#role').val();
    var dt_basic1 = dt_basic_table1.DataTable({
      ajax: '/getProjectsList/',
      columns: [
        { data: 'id' },
        { data: 'id' },
        { data: 'id' }, // used for sorting so will hide this column
        { data: 'project_name' },
        { data: 'project_type' },
        { data: 'priority' },
        { data: 'number_of_task' },
        { data: 'start_date' },
        { data: 'due_date' },
        { data: 'status' },
        { data: '' }
      ],
      columnDefs: [
        {
          // For Responsive
          className: 'control',
          orderable: false,
          responsivePriority: 2,
          targets: 0
        },
        {
          // For Checkboxes
          targets: 1,
          orderable: false,
          responsivePriority: 3,
          visible: false
        },
        {
          targets: 2,
          visible: false
        },
        {
          responsivePriority: 1,
          targets: 4,
          render: function (data, type, full, meta) {
            return '<span class="badge rounded-pill badge-light-primary">'+data+'</span>'
          }
        },
        {
          responsivePriority: 1,
          targets: 6,
          render: function (data, type, full, meta) {
            return '<span class="badge rounded-pill badge-light-info">'+data+'</span>'
          }
        },
        {
          // Label
          targets: 5,
          render: function (data, type, full, meta) {
            var $priority_number = full['priority'];
            var $priority = {
              1: { title: 'Critical', class: 'badge-light-danger' },
              2: { title: 'High', class: ' badge-light-warning' },
              3: { title: 'Medium', class: ' badge-light-success' },
              4: { title: 'Low', class: ' badge-light-info' },
              5: { title: 'Not Assigned', class: ' badge-light-primary' },
            };
            if (typeof $priority[$priority_number] === 'undefined') {
              return data;
            }
            return (
              '<span class="badge rounded-pill ' +
              $priority[$priority_number].class +
              '">' +
              $priority[$priority_number].title +
              '</span>'
            );
          }
        },
        {
          // Label
          targets: -2,
          render: function (data, type, full, meta) {
            var $status_number = full['status'];
            var $status = {
              1: { title: 'Red', class: 'badge-light-danger' },
              2: { title: 'Amber', class: ' badge-light-warning' },
              3: { title: 'Green', class: ' badge-light-success' }
            };
            if (typeof $status[$status_number] === 'undefined') {
              return data;
            }
            return (
              '<span class="badge rounded-pill ' +
              $status[$status_number].class +
              '">' +
              $status[$status_number].title +
              '</span>'
            );
          }
        },
        {
          // Actions
          targets: -1,
          title: 'Actions',
          orderable: false,
          render: function (data, type, full, meta) {
            return (
              user_role != 'developer' ?
              '<a href="javascript:;" class="item-edit mr-10" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top" onclick="editProject('+full.id+')">' +
              feather.icons['edit'].toSvg({ class: 'font-small-4' }) +
              '</a>' +
              '<a href="/view/'+full.id+'" class="item-edit mr-10">' +
              feather.icons['eye'].toSvg({ class: 'font-small-4' }) +
              '</a>'+
              '<a href="javascript:;" class="item-edit" onclick="addTask('+full.id+')">' +
              feather.icons['plus'].toSvg({ class: 'font-small-4' }) +
              '</a>':'<a href="/view/'+full.id+'" class="item-edit mr-10">' +
              feather.icons['eye'].toSvg({ class: 'font-small-4' }) +
              '</a>'+
              '<a href="javascript:;" class="item-edit" onclick="addTask('+full.id+')">' +
              feather.icons['plus'].toSvg({ class: 'font-small-4' }) +
              '</a>'
            );
          }
        }
      ],
      order: [[2, 'desc']],
      dom: '<"card-header border-bottom p-1"<"head-label"><"dt-action-buttons text-end"B>><"d-flex justify-content-between align-items-center mx-0 row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>t<"d-flex justify-content-between mx-0 row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
      displayLength: 8,
      lengthMenu: [7, 10, 25, 50, 75, 100],
      buttons: [
        {
          extend: 'collection',
          className: 'btn btn-outline-secondary dropdown-toggle me-2',
          text: feather.icons['share'].toSvg({ class: 'font-small-4 me-50' }) + 'Export',
          buttons: [
            {
              extend: 'print',
              text: feather.icons['printer'].toSvg({ class: 'font-small-4 me-50' }) + 'Print',
              className: 'dropdown-item',
              exportOptions: { columns: [3, 4, 5, 6, 7, 8, 9] }
            },
            {
              extend: 'csv',
              text: feather.icons['file-text'].toSvg({ class: 'font-small-4 me-50' }) + 'Csv',
              className: 'dropdown-item',
              exportOptions: { columns: [3, 4, 5, 6, 7, 8, 9] }
            },
            {
              extend: 'excel',
              text: feather.icons['file'].toSvg({ class: 'font-small-4 me-50' }) + 'Excel',
              className: 'dropdown-item',
              exportOptions: { columns: [3, 4, 5, 6, 7, 8, 9] }
            },
            {
              extend: 'pdf',
              text: feather.icons['clipboard'].toSvg({ class: 'font-small-4 me-50' }) + 'Pdf',
              className: 'dropdown-item',
              exportOptions: { columns: [3, 4, 5, 6, 7, 8, 9] }
            },
            {
              extend: 'copy',
              text: feather.icons['copy'].toSvg({ class: 'font-small-4 me-50' }) + 'Copy',
              className: 'dropdown-item',
              exportOptions: { columns: [3, 4, 5, 6, 7, 8, 9] }
            }
          ],
          init: function (api, node, config) {
            $(node).removeClass('btn-secondary');
            $(node).parent().removeClass('btn-group');
            setTimeout(function () {
              $(node).closest('.dt-buttons').removeClass('btn-group').addClass('d-inline-flex');
            }, 50);
          }
        },
        {
          text: feather.icons['plus'].toSvg({ class: 'me-50 font-small-4' }) + 'Add New Project',
          className: user_role != 'developer' ? 'create-new btn btn-primary' : 'create-new btn btn-primary disNone',
          attr: {
            'onclick': 'addNewProject()',
            'data-bs-toggle': 'modal',
            'data-bs-target': '#modals-add-project'
          },
          init: function (api, node, config) {
            $(node).removeClass('btn-secondary');
          }
        }
      ],
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (row) {
              var data = row.data();
              return 'Details of ' + data['project_name'];
            }
          }),
          type: 'column',
          renderer: function (api, rowIdx, columns) {
            var data = $.map(columns, function (col, i) {
              return col.title !== '' // ? Do not show row in modal popup if title is blank (for check box)
                ? '<tr data-dt-row="' +
                    col.rowIdx +
                    '" data-dt-column="' +
                    col.columnIndex +
                    '">' +
                    '<td>' +
                    col.title +
                    ':' +
                    '</td> ' +
                    '<td>' +
                    col.data +
                    '</td>' +
                    '</tr>'
                : '';
            }).join('');

            return data ? $('<table class="table"/>').append('<tbody>' + data + '</tbody>') : false;
          }
        }
      },
      language: {
        paginate: {
          // remove previous & next text from pagination
          previous: '&nbsp;',
          next: '&nbsp;'
        }
      },
      initComplete: function () {
        this.api()
          .columns([4])
          .every(function () {
          var column = this;
          var column_id = this.header().textContent.replace(/[\W]/g, '-');
          var select = $(
            '<select id="projectType" class="select2 form-control text-capitalize"><option value=""> Select '+this.header().textContent+'</option></select>'
          )
            .appendTo('.project_type')
            .on('change', function () {
               var data = $.map($(this).select2('data'), function (value, key) {
                    return value.text ? '^' + $.fn.dataTable.util.escapeRegex(value.text) + '$' : null;
               });
               //if no data selected use ""
               if (data.length === 0) {
                   data = [""];
               }
               //join array into string with regex or (|)
               var val = data.join('|');
               //search for the option(s) selected
               column
                   .search(val ? val : '', true, false)
                   .draw();
           });

          column
            .data()
            .unique()
            .sort()
            .each(function (d, j) {
              if (d != '') {
                select.append('<option value="' + d + '" class="text-capitalize">' + d + '</option>');
              }
            });
          $('#projectType').select2({
              placeholder: "Search "+this.header().textContent
          });
        });

        this.api()
          .columns([5])
          .every(function () {
          var column = this;
          var column_id = this.header().textContent.replace(/[\W]/g, '-');
          var select = $(
            '<select id="projectPriority" class="select2 form-control text-capitalize"><option value=""> Select '+this.header().textContent+'</option></select>'
          )
            .appendTo('.project_priority')
            .on('change', function () {
               var data = $.map($(this).select2('data'), function (value, key) {
                    return value.text ? '^' + $.fn.dataTable.util.escapeRegex(value.text) + '$' : null;
               });
               //if no data selected use ""
               if (data.length === 0) {
                   data = [""];
               }
               //join array into string with regex or (|)
               var val = data.join('|');
               //search for the option(s) selected
               column
                   .search(val ? val : '', true, false)
                   .draw();
           });

          column
            .data()
            .unique()
            .sort()
            .each(function (d, j) {
              var $priority_number = d;
              var $priority = {
                1: { title: 'Critical'},
                2: { title: 'High'},
                3: { title: 'Medium'},
                4: { title: 'Low'},
                5: { title: 'Not Assigned'}
              };
              if($priority[$priority_number]){
                select.append('<option value="' + d + '" class="text-capitalize">' + $priority[$priority_number]['title'] + '</option>');
              }
            });
          $('#projectPriority').select2({
              placeholder: "Search "+this.header().textContent
          });
        });

        this.api()
          .columns([9])
          .every(function () {
          var column = this;
          var column_id = this.header().textContent.replace(/[\W]/g, '-');
          var select = $(
            '<select id="projectStatus" class="select2 form-control text-capitalize"><option value=""> Select '+this.header().textContent+'</option></select>'
          )
            .appendTo('.project_status')
            .on('change', function () {
               var data = $.map($(this).select2('data'), function (value, key) {
                    return value.text ? '^' + $.fn.dataTable.util.escapeRegex(value.text) + '$' : null;
               });
               //if no data selected use ""
               if (data.length === 0) {
                   data = [""];
               }
               //join array into string with regex or (|)
               var val = data.join('|');
               //search for the option(s) selected
               column
                   .search(val ? val : '', true, false)
                   .draw();
           });

          column
            .data()
            .unique()
            .sort()
            .each(function (d, j) {
              var $status_number = d;
              var $status = {
                1: { title: 'Red'},
                2: { title: 'Amber'},
                3: { title: 'Green'}
              };
              if($status[$status_number]){
                select.append('<option value="' + d + '" class="text-capitalize">' + $status[$status_number]['title'] + '</option>');
              } 
            });
          $('#projectStatus').select2({
              placeholder: "Search "+this.header().textContent
          });
        });
      }
    });    
    $('div.head-label').html('<h6 class="mb-0">List of Projects</h6>');
  }


  if (dt_basic_table_task.length) {
    var project_id = $('#project_id').val();
    var user_role = $('#role').val();
    var user_id = $('#user_id').val();
    var dt_basic1 = dt_basic_table_task.DataTable({
      ajax: '/getProjectsTaskList/'+project_id,
      columns: [
        { data: 'id' },
        { data: 'id' },
        { data: 'id' }, // used for sorting so will hide this column
        { data: 'level_2' },
        { data: 'level_3' },
        { data: 'progress' },
        { data: 'priority' },
        { data: 'start_date' },
        { data: 'due_date' },
        { data: 'comment' },
        { data: '' }
      ],
      columnDefs: [
        {
          // For Responsive
          className: 'control',
          orderable: false,
          responsivePriority: 2,
          targets: 0
        },
        {
          // For Checkboxes
          targets: 1,
          orderable: false,
          responsivePriority: 3,
          visible: false
        },
        {
          targets: 2,
          visible: false
        },
        {
          responsivePriority: 1,
          targets: 4
        },
        {
          // Label
          targets: 6,
          render: function (data, type, full, meta) {
            var $priority_number = full['priority'];
            var $priority = {
              1: { title: 'Critical', class: 'badge-light-danger' },
              2: { title: 'High', class: ' badge-light-warning' },
              3: { title: 'Medium', class: ' badge-light-success' },
              4: { title: 'Low', class: ' badge-light-info' },
              5: { title: 'Not Assigned', class: ' badge-light-primary' },
            };
            if (typeof $priority[$priority_number] === 'undefined') {
              return data;
            }
            return (
              '<span class="badge rounded-pill ' +
              $priority[$priority_number].class +
              '">' +
              $priority[$priority_number].title +
              '</span>'
            );
          }
        },        
        {
          // Label
          targets: 5,
          render: function (data, type, full, meta) {
            var $status_number = data;
            var $status = {
              1: { title: 'Complete', class: 'bg-success' },
              2: { title: 'Dependent Story', class: 'bg-danger' },
              3: { title: 'In Progress-Watch', class: 'bg-warning' },
              4: { title: 'Not Started', class: 'bg-info' },
              5: { title: 'In Progress-On Track', class: 'bg-primary' },
              6: { title: 'At Risk', class: 'bg-danger' }
            };

            if (typeof $status[$status_number] === 'undefined') {
              return data;
            }
            return (
              '<span class="badge rounded-pill ' +
              $status[$status_number].class +
              '">' +
              $status[$status_number].title +
              '</span>'
            );
          }
        },
        {
          // Actions
          targets: -1,
          title: 'Actions',
          orderable: false,
          render: function (data, type, full, meta) {
            var view_action = '<a href="javascript:;" class="item-edit mr-10" onclick="viewTask('+full.id+')">' +
            feather.icons['eye'].toSvg({ class: 'font-small-4' }) +
            '</a>';
            var edit_action = '<a href="javascript:;" class="item-edit mr-10" onclick="editTask('+full.id+')">' +
            feather.icons['edit'].toSvg({ class: 'font-small-4' }) +
            '</a>'; 
            var comment_action = '<a href="javascript:;" class="item-edit mr-10" onclick="addComment('+full.id+')">' +
            feather.icons['message-circle'].toSvg({ class: 'font-small-4' }) +
            '</a>';
            var change_status_action = '<a href="javascript:;" class="item-edit mr-10" onclick="changeStatus('+full.id+')">' +
            feather.icons['toggle-right'].toSvg({ class: 'font-small-4' }) +
            '</a>';
            var delete_action = '<a href="javascript:;" class="item-edit" onclick="deleteTask('+full.id+')">' +
            feather.icons['trash-2'].toSvg({ class: 'font-small-4' }) +
            '</a>';
            var approve_action = '<a href="javascript:;" class="item-edit" onclick="approveTask('+full.id+')">' +
            feather.icons['check'].toSvg({ class: 'font-small-4' }) +
            '</a>';
            return (
              full.approval == 2 ? 
                full.progress != 1 ?
                  full.created_by == user_id || user_role != 'developer'? 
                    view_action+edit_action+comment_action+change_status_action+delete_action
                  :
                  view_action+comment_action+change_status_action
                : 
                  '' 
                :
                  user_role != 'developer' ?
                    approve_action
                  :
                    'Not Approved'              
            );
          }
        }
      ],
      order: [[2, 'desc']],
      dom: '<"card-header border-bottom p-1"<"head-label"><"dt-action-buttons text-end"B>><"d-flex justify-content-between align-items-center mx-0 row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>t<"d-flex justify-content-between mx-0 row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
      displayLength: 8,
      lengthMenu: [7, 10, 25, 50, 75, 100],
      buttons: [
        {
          extend: 'collection',
          className: 'btn btn-outline-secondary dropdown-toggle me-2',
          text: feather.icons['share'].toSvg({ class: 'font-small-4 me-50' }) + 'Export',
          buttons: [
            {
              extend: 'print',
              text: feather.icons['printer'].toSvg({ class: 'font-small-4 me-50' }) + 'Print',
              className: 'dropdown-item',
              exportOptions: { columns: [3, 4, 5, 6, 7, 8, 9] }
            },
            {
              extend: 'csv',
              text: feather.icons['file-text'].toSvg({ class: 'font-small-4 me-50' }) + 'Csv',
              className: 'dropdown-item',
              exportOptions: { columns: [3, 4, 5, 6, 7, 8, 9] }
            },
            {
              extend: 'excel',
              text: feather.icons['file'].toSvg({ class: 'font-small-4 me-50' }) + 'Excel',
              className: 'dropdown-item',
              exportOptions: { columns: [3, 4, 5, 6, 7, 8, 9] }
            },
            {
              extend: 'pdf',
              text: feather.icons['clipboard'].toSvg({ class: 'font-small-4 me-50' }) + 'Pdf',
              className: 'dropdown-item',
              exportOptions: { columns: [3, 4, 5, 6, 7, 8, 9] }
            },
            {
              extend: 'copy',
              text: feather.icons['copy'].toSvg({ class: 'font-small-4 me-50' }) + 'Copy',
              className: 'dropdown-item',
              exportOptions: { columns: [3, 4, 5, 6, 7, 8, 9] }
            }
          ],
          init: function (api, node, config) {
            $(node).removeClass('btn-secondary');
            $(node).parent().removeClass('btn-group');
            setTimeout(function () {
              $(node).closest('.dt-buttons').removeClass('btn-group').addClass('d-inline-flex');
            }, 50);
          }
        },
        {
          text: feather.icons['plus'].toSvg({ class: 'me-50 font-small-4' }) + 'Add New Task',
          className: 'create-new btn btn-primary',
          attr: {
            'onclick': 'addNewTask()',
            'data-bs-toggle': 'modal',
            'data-bs-target': '#modals-slide-in'
          },
          init: function (api, node, config) {
            $(node).removeClass('btn-secondary');
          }
        }
      ],
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (row) {
              var data = row.data();
              return 'Details of ' + data['level_2'];
            }
          }),
          type: 'column',
          renderer: function (api, rowIdx, columns) {
            var data = $.map(columns, function (col, i) {
              return col.title !== '' // ? Do not show row in modal popup if title is blank (for check box)
                ? '<tr data-dt-row="' +
                    col.rowIdx +
                    '" data-dt-column="' +
                    col.columnIndex +
                    '">' +
                    '<td>' +
                    col.title +
                    ':' +
                    '</td> ' +
                    '<td>' +
                    col.data +
                    '</td>' +
                    '</tr>'
                : '';
            }).join('');

            return data ? $('<table class="table"/>').append('<tbody>' + data + '</tbody>') : false;
          }
        }
      },
      language: {
        paginate: {
          // remove previous & next text from pagination
          previous: '&nbsp;',
          next: '&nbsp;'
        }
      },
      initComplete: function () {
        this.api()
          .columns([3])
          .every(function () {
          var column = this;
          var column_id = this.header().textContent.replace(/[\W]/g, '-');
          var select = $(
            '<select id="taskLevel2" class="select2 form-control text-capitalize"><option value=""> Select '+this.header().textContent+'</option></select>'
          )
            .appendTo('.task_level2')
            .on('change', function () {
               var data = $.map($(this).select2('data'), function (value, key) {
                    return value.text ? '^' + $.fn.dataTable.util.escapeRegex(value.text) + '$' : null;
               });
               //if no data selected use ""
               if (data.length === 0) {
                   data = [""];
               }
               //join array into string with regex or (|)
               var val = data.join('|');
               //search for the option(s) selected
               column
                   .search(val ? val : '', true, false)
                   .draw();
           });

          column
            .data()
            .unique()
            .sort()
            .each(function (d, j) {
              if (d != '') {
                select.append('<option value="' + d + '" class="text-capitalize">' + d + '</option>');
              }
            });
          $('#taskLevel2').select2({
              placeholder: "Search "+this.header().textContent
          });
        });

        this.api()
          .columns([6])
          .every(function () {
          var column = this;
          var column_id = this.header().textContent.replace(/[\W]/g, '-');
          var select = $(
            '<select id="taskPriority" class="select2 form-control text-capitalize"><option value=""> Select '+this.header().textContent+'</option></select>'
          )
            .appendTo('.task_priority')
            .on('change', function () {
               var data = $.map($(this).select2('data'), function (value, key) {
                    return value.text ? '^' + $.fn.dataTable.util.escapeRegex(value.text) + '$' : null;
               });
               //if no data selected use ""
               if (data.length === 0) {
                   data = [""];
               }
               //join array into string with regex or (|)
               var val = data.join('|');
               //search for the option(s) selected
               column
                   .search(val ? val : '', true, false)
                   .draw();
           });

          column
            .data()
            .unique()
            .sort()
            .each(function (d, j) {
              var $priority_number = d;
              var $priority = {
                1: { title: 'Critical'},
                2: { title: 'High'},
                3: { title: 'Medium'},
                4: { title: 'Low'},
                5: { title: 'Not Assigned'}
              };
              if($priority[$priority_number]){
                select.append('<option value="' + d + '" class="text-capitalize">' + $priority[$priority_number]['title'] + '</option>');
              }
            });
          $('#taskPriority').select2({
              placeholder: "Search "+this.header().textContent
          });
        });

        this.api()
          .columns([5])
          .every(function () {
          var column = this;
          var column_id = this.header().textContent.replace(/[\W]/g, '-');
          var select = $(
            '<select id="taskStatus" class="select2 form-control text-capitalize"><option value=""> Select '+this.header().textContent+'</option></select>'
          )
            .appendTo('.task_status')
            .on('change', function () {
               var data = $.map($(this).select2('data'), function (value, key) {
                    return value.text ? '^' + $.fn.dataTable.util.escapeRegex(value.text) + '$' : null;
               });
               //if no data selected use ""
               if (data.length === 0) {
                   data = [""];
               }
               //join array into string with regex or (|)
               var val = data.join('|');
               //search for the option(s) selected
               column
                   .search(val ? val : '', true, false)
                   .draw();
           });

          column
            .data()
            .unique()
            .sort()
            .each(function (d, j) {
              var $status_number = d;
              var $status = {
                1: { title: 'Complete'},
                2: { title: 'Dependent Story'},
                3: { title: 'In Progress-Watch'},
                4: { title: 'Not Started'},
                5: { title: 'In Progress-On Track'},
                6: { title: 'At Risk'}
              };
              if($status[$status_number]){
                select.append('<option value="' + d + '" class="text-capitalize">' + $status[$status_number]['title'] + '</option>');
              } 
            });
          $('#taskStatus').select2({
              placeholder: "Search "+this.header().textContent
          });
        });
      }
    });    
    $('div.head-label').html('<h6 class="mb-0">List Of Project Task</h6>');
  }

  // Flat Date picker
  if (dt_date_table.length) {
    dt_date_table.flatpickr({
      monthSelectorType: 'static',
      dateFormat: 'Y-m-d'
    });
  }

  // Add New record
  // ? Remove/Update this code as per your requirements ?
  var count = 101;
  $('.data-submit').on('click', function () {
    var $new_name = $('.add-new-record .dt-full-name').val(),
      $new_post = $('.add-new-record .dt-post').val(),
      $new_email = $('.add-new-record .dt-email').val(),
      $new_date = $('.add-new-record .dt-date').val(),
      $new_salary = $('.add-new-record .dt-salary').val();

    if ($new_name != '') {
      dt_basic.row
        .add({
          responsive_id: null,
          id: count,
          full_name: $new_name,
          post: $new_post,
          email: $new_email,
          start_date: $new_date,
          salary: '$' + $new_salary,
          status: 5
        })
        .draw();
      count++;
      $('.modal').modal('hide');
    }
  });

  // Delete Record
  $('.datatables-basic tbody').on('click', '.delete-record', function () {
    dt_basic.row($(this).parents('tr')).remove().draw();
  });

  // Complex Header DataTable
  // --------------------------------------------------------------------

  if (dt_complex_header_table.length) {
    var dt_complex = dt_complex_header_table.DataTable({
      ajax: assetPath + 'data/table-datatable.json',
      columns: [
        { data: 'full_name' },
        { data: 'email' },
        { data: 'city' },
        { data: 'post' },
        { data: 'salary' },
        { data: 'status' },
        { data: '' }
      ],
      columnDefs: [
        {
          // Label
          targets: -2,
          render: function (data, type, full, meta) {
            var $status_number = full['status'];
            var $status = {
              1: { title: 'Current', class: 'badge-light-primary' },
              2: { title: 'Professional', class: ' badge-light-success' },
              3: { title: 'Rejected', class: ' badge-light-danger' },
              4: { title: 'Resigned', class: ' badge-light-warning' },
              5: { title: 'Applied', class: ' badge-light-info' }
            };
            if (typeof $status[$status_number] === 'undefined') {
              return data;
            }
            return (
              '<span class="badge rounded-pill ' +
              $status[$status_number].class +
              '">' +
              $status[$status_number].title +
              '</span>'
            );
          }
        },
        {
          // Actions
          targets: -1,
          title: 'Actions',
          orderable: false,
          render: function (data, type, full, meta) {
            return (
              '<div class="d-inline-flex">' +
              '<a class="pe-1 dropdown-toggle hide-arrow text-primary" data-bs-toggle="dropdown">' +
              feather.icons['more-vertical'].toSvg({ class: 'font-small-4' }) +
              '</a>' +
              '<div class="dropdown-menu dropdown-menu-end">' +
              '<a href="javascript:;" class="dropdown-item">' +
              feather.icons['file-text'].toSvg({ class: 'me-50 font-small-4' }) +
              'Details</a>' +
              '<a href="javascript:;" class="dropdown-item">' +
              feather.icons['archive'].toSvg({ class: 'me-50 font-small-4' }) +
              'Archive</a>' +
              '<a href="javascript:;" class="dropdown-item delete-record">' +
              feather.icons['trash-2'].toSvg({ class: 'me-50 font-small-4' }) +
              'Delete</a>' +
              '</div>' +
              '</div>' +
              '<a href="javascript:;" class="item-edit">' +
              feather.icons['edit'].toSvg({ class: 'font-small-4' }) +
              '</a>'
            );
          }
        }
      ],
      dom: '<"d-flex justify-content-between align-items-center mx-0 row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>t<"d-flex justify-content-between mx-0 row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
      displayLength: 7,
      lengthMenu: [7, 10, 25, 50, 75, 100],
      language: {
        paginate: {
          // remove previous & next text from pagination
          previous: '&nbsp;',
          next: '&nbsp;'
        }
      }
    });
  }

  // Row Grouping
  // --------------------------------------------------------------------

  var groupColumn = 2;
  if (dt_row_grouping_table.length) {
    var groupingTable = dt_row_grouping_table.DataTable({
      ajax: assetPath + 'data/table-datatable.json',
      columns: [
        { data: 'responsive_id' },
        { data: 'full_name' },
        { data: 'post' },
        { data: 'email' },
        { data: 'city' },
        { data: 'start_date' },
        { data: 'salary' },
        { data: 'status' },
        { data: '' }
      ],
      columnDefs: [
        {
          // For Responsive
          className: 'control',
          orderable: false,
          targets: 0
        },
        { visible: false, targets: groupColumn },
        {
          // Label
          targets: -2,
          render: function (data, type, full, meta) {
            var $status_number = full['status'];
            var $status = {
              1: { title: 'Current', class: 'badge-light-primary' },
              2: { title: 'Professional', class: ' badge-light-success' },
              3: { title: 'Rejected', class: ' badge-light-danger' },
              4: { title: 'Resigned', class: ' badge-light-warning' },
              5: { title: 'Applied', class: ' badge-light-info' }
            };
            if (typeof $status[$status_number] === 'undefined') {
              return data;
            }
            return (
              '<span class="badge rounded-pill ' +
              $status[$status_number].class +
              '">' +
              $status[$status_number].title +
              '</span>'
            );
          }
        },
        {
          // Actions
          targets: -1,
          title: 'Actions',
          orderable: false,
          render: function (data, type, full, meta) {
            return (
              '<div class="d-inline-flex">' +
              '<a class="pe-1 dropdown-toggle hide-arrow text-primary" data-bs-toggle="dropdown">' +
              feather.icons['more-vertical'].toSvg({ class: 'font-small-4' }) +
              '</a>' +
              '<div class="dropdown-menu dropdown-menu-end">' +
              '<a href="javascript:;" class="dropdown-item">' +
              feather.icons['file-text'].toSvg({ class: 'me-50 font-small-4' }) +
              'Details</a>' +
              '<a href="javascript:;" class="dropdown-item">' +
              feather.icons['archive'].toSvg({ class: 'me-50 font-small-4' }) +
              'Archive</a>' +
              '<a href="javascript:;" class="dropdown-item delete-record">' +
              feather.icons['trash-2'].toSvg({ class: 'me-50 font-small-4' }) +
              'Delete</a>' +
              '</div>' +
              '</div>' +
              '<a href="javascript:;" class="item-edit">' +
              feather.icons['edit'].toSvg({ class: 'font-small-4' }) +
              '</a>'
            );
          }
        }
      ],
      order: [[groupColumn, 'asc']],
      dom: '<"d-flex justify-content-between align-items-center mx-0 row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>t<"d-flex justify-content-between mx-0 row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
      displayLength: 7,
      lengthMenu: [7, 10, 25, 50, 75, 100],
      drawCallback: function (settings) {
        var api = this.api();
        var rows = api.rows({ page: 'current' }).nodes();
        var last = null;

        api
          .column(groupColumn, { page: 'current' })
          .data()
          .each(function (group, i) {
            if (last !== group) {
              $(rows)
                .eq(i)
                .before('<tr class="group"><td colspan="8">' + group + '</td></tr>');

              last = group;
            }
          });
      },
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (row) {
              var data = row.data();
              return 'Details of ' + data['full_name'];
            }
          }),
          type: 'column',
          renderer: function (api, rowIdx, columns) {
            var data = $.map(columns, function (col, i) {
              return col.title !== '' // ? Do not show row in modal popup if title is blank (for check box)
                ? '<tr data-dt-row="' +
                    col.rowIdx +
                    '" data-dt-column="' +
                    col.columnIndex +
                    '">' +
                    '<td>' +
                    col.title +
                    ':' +
                    '</td> ' +
                    '<td>' +
                    col.data +
                    '</td>' +
                    '</tr>'
                : '';
            }).join('');

            return data ? $('<table class="table"/>').append('<tbody>' + data + '</tbody>') : false;
          }
        }
      },
      language: {
        paginate: {
          // remove previous & next text from pagination
          previous: '&nbsp;',
          next: '&nbsp;'
        }
      }
    });

    // Order by the grouping
    $('.dt-row-grouping tbody').on('click', 'tr.group', function () {
      var currentOrder = table.order()[0];
      if (currentOrder[0] === groupColumn && currentOrder[1] === 'asc') {
        groupingTable.order([groupColumn, 'desc']).draw();
      } else {
        groupingTable.order([groupColumn, 'asc']).draw();
      }
    });
  }

  // Multilingual DataTable
  // --------------------------------------------------------------------

  var lang = 'German';
  if (dt_multilingual_table.length) {
    var table_language = dt_multilingual_table.DataTable({
      ajax: assetPath + 'data/table-datatable.json',
      columns: [
        { data: 'responsive_id' },
        { data: 'full_name' },
        { data: 'post' },
        { data: 'email' },
        { data: 'start_date' },
        { data: 'salary' },
        { data: 'status' },
        { data: '' }
      ],
      columnDefs: [
        {
          // For Responsive
          className: 'control',
          orderable: false,
          targets: 0
        },
        {
          // Label
          targets: -2,
          render: function (data, type, full, meta) {
            var $status_number = full['status'];
            var $status = {
              1: { title: 'Current', class: 'badge-light-primary' },
              2: { title: 'Professional', class: ' badge-light-success' },
              3: { title: 'Rejected', class: ' badge-light-danger' },
              4: { title: 'Resigned', class: ' badge-light-warning' },
              5: { title: 'Applied', class: ' badge-light-info' }
            };
            if (typeof $status[$status_number] === 'undefined') {
              return data;
            }
            return (
              '<span class="badge rounded-pill ' +
              $status[$status_number].class +
              '">' +
              $status[$status_number].title +
              '</span>'
            );
          }
        },
        {
          // Actions
          targets: -1,
          title: 'Actions',
          orderable: false,
          render: function (data, type, full, meta) {
            return (
              '<div class="d-inline-flex">' +
              '<a class="pe-1 dropdown-toggle hide-arrow text-primary" data-bs-toggle="dropdown">' +
              feather.icons['more-vertical'].toSvg({ class: 'font-small-4' }) +
              '</a>' +
              '<div class="dropdown-menu dropdown-menu-end">' +
              '<a href="javascript:;" class="dropdown-item">' +
              feather.icons['file-text'].toSvg({ class: 'me-50 font-small-4' }) +
              'Details</a>' +
              '<a href="javascript:;" class="dropdown-item">' +
              feather.icons['archive'].toSvg({ class: 'me-50 font-small-4' }) +
              'Archive</a>' +
              '<a href="javascript:;" class="dropdown-item delete-record">' +
              feather.icons['trash-2'].toSvg({ class: 'me-50 font-small-4' }) +
              'Delete</a>' +
              '</div>' +
              '</div>' +
              '<a href="javascript:;" class="item-edit">' +
              feather.icons['edit'].toSvg({ class: 'font-small-4' }) +
              '</a>'
            );
          }
        }
      ],
      language: {
        url: '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/' + lang + '.json',
        paginate: {
          // remove previous & next text from pagination
          previous: '&nbsp;',
          next: '&nbsp;'
        }
      },
      dom: '<"d-flex justify-content-between align-items-center mx-0 row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>t<"d-flex justify-content-between mx-0 row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
      displayLength: 7,
      lengthMenu: [7, 10, 25, 50, 75, 100],
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (row) {
              var data = row.data();
              return 'Details of ' + data['full_name'];
            }
          }),
          type: 'column',
          renderer: function (api, rowIdx, columns) {
            var data = $.map(columns, function (col, i) {
              return col.title !== '' // ? Do not show row in modal popup if title is blank (for check box)
                ? '<tr data-dt-row="' +
                    col.rowIdx +
                    '" data-dt-column="' +
                    col.columnIndex +
                    '">' +
                    '<td>' +
                    col.title +
                    ':' +
                    '</td> ' +
                    '<td>' +
                    col.data +
                    '</td>' +
                    '</tr>'
                : '';
            }).join('');

            return data ? $('<table class="table"/>').append('<tbody>' + data + '</tbody>') : false;
          }
        }
      }
    });
  }
});
