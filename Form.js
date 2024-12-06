$(document).ready(function () {

    initValidate();
     loadEmployees();

});


function showModal1() {
    console.log("Create button clicked");
    $('#createModal').css('display', 'flex');
}


function closeModal1() {
    $('#createModal').css('display', 'none');
}

$(window).on('click', function (event) {
    if ($(event.target).is('#createModal')) {
        closeModal1();
    }
});


function initValidate(){
     $("#basic-form").validate({
             rules: {

              name: {
                     required: true,
                     minlength: 2
                 },
             },

             messages: {

                  name: {
                       required: "*Employee name is required",
                       minlength: "Employee must be at least 2 characters long"
                  },


             },

             submitHandler: function (form) {
                   var formFields = $(form).serializeArray();
                   var formData = {};
                   $.each(formFields, function(i,v){
                        formData[v.name] = (v.value).trim();
                   });
                   saveEmployee(formData);
             }
     });

}


$("#basic-form").submit(function (event) {
    event.preventDefault();

    const employeeData = {
        name: $("#name").val(),
        description: $("#description").val()
    };
});

function saveEmployee(employeeData) {
    $.ajax({
        url: "http://localhost:8080/pico_branch/save",
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(employeeData),
        success: function (response) {
            Swal.fire({
                title: 'Success!',
                text: 'Employee created successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                closeModal1();
                $("#basic-form")[0].reset();
                loadEmployees();

            });
        },
        error: function (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to create employee',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });
}


function loadEmployees() {
    $.ajax({
        url: 'http://localhost:8080/pico_branch/get_all',
        method: 'POST',
        success: function (response) {
            console.log(response);
            $(".employee-list").empty();

            response.data.forEach(employee => {
                $(".employee-list").append(`
                    <div class="employee-item" data-id="${employee.id}">
                        <div><strong>Name:</strong> ${employee.name}</div>
                        <div><strong>Description:</strong> ${employee.description}</div>
                        <button class="toggle-actions-button" data-id="${employee.id}">⋮</button>
                        <div class="actions-dropdown" style="display: none; position: absolute;">
                            <button class="update-button" data-id="${employee.id}" data-name="${employee.name}" data-description="${employee.description}">Update</button>
                            <button class="delete-button" data-id="${employee.id}">Delete</button>
                        </div>
                    </div>
                `);
            });


          $(".toggle-actions-button").click(function (e) {

              if ($(".modal").is(":visible")) {

                  $(".actions-dropdown").hide();
                  return;
              }

              e.stopPropagation();

              const dropdown = $(this).siblings(".actions-dropdown");


              $(".actions-dropdown").not(dropdown).hide();


              dropdown.toggle();
          });


          $(document).click(function () {
              $(".actions-dropdown").hide();
          });


//          function showModal() {
//              $(".modal").show();
//          }
//
//          function closeModal() {
//              $(".modal").hide();
//          }



            $(".toggle-actions-button").click(function () {
                const parent = $(this).closest(".employee-item");
                parent.find(".actions").toggle();
            });

            $(".update-button").click(function () {
                const employeeId = $(this).data("id");
                const employeeName = $(this).data("name");
                const employeeDescription = $(this).data("description");

                $("#employee-id").val(employeeId);
                $("#employee-name").val(employeeName);
                $("#employee-description").val(employeeDescription);

                showModal();
            });

            $(".delete-button").click(function () {
                const employeeId = $(this).data("id");

                Swal.fire({
                    title: 'Are you sure?',
                    text: 'You won\'t be able to revert this!',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.isConfirmed) {
                        deleteEmployee(employeeId);
                    }
                });
            });
        },
        error: function (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to load employees',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });
}


function showModal() {
    $('#update-modal').css('display', 'flex');
}

function closeModal() {
     $('#update-modal').css('display', 'none');
}

$("#update-employee-form").submit(function (e) {
    e.preventDefault();

    const employeeData = {
        id: $("#employee-id").val(),
        name: $("#employee-name").val(),
        description: $("#employee-description").val()
    };

    $.ajax({
        url: 'http://localhost:8080/pico_branch/save',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(employeeData),
        success: function (response) {
            Swal.fire({
                title: 'Success!',
                text: 'Employee updated successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            });


            loadEmployees();
            closeModal();
        },
        error: function (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update employee',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });
});

//$(document).ready(function () {
//     loadEmployees();
//});

function deleteEmployee(employeeId) {
    $.ajax({
        url: 'http://localhost:8080/pico_branch/trash',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ id: employeeId }),
        success: function (response) {
            Swal.fire({
                title: 'Deleted!',
                text: 'Employee has been deleted.',
                icon: 'success',
                confirmButtonText: 'OK'
            });


             loadEmployees();
        },
        error: function (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete the employee',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });
}











