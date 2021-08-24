var role = {
    userRole: "",
    getUserRole() {
        return this.userRole
    },

    setUserRole(role){
        this.userRole = role;
    }
}

var email = {
    userEmail: "",
    getUserEmail() {
        return this.userEmail
    },

    setUserEmail(email){
        this.userEmail = email;
    }
}

var zoho_id = {
    userZohoID: "",
    getUserZohoID() {
        return this.userEmail
    },

    setUserZohoID(zoho_id){
        this.userZohoID = zoho_id;
    }
}

var module = {
    module: "",
    getModule() {
        return this.module
    },

    setModule(module){
        this.module = module;
    }
}

function profile() {
    window.location.href = "profile.html"; //Add your app domain
}

function logout() {
    var redirectURL = "http://localhost:3000/app/login.html"; //Add your app domain
    var auth = catalyst.auth;
    auth.signOut(redirectURL);
}

function navigate() {
    window.location.href = 'https://accounts.zoho.eu/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.settings.ALL,ZohoBooks.fullaccess.all&client_id=1000.IYF7J63XV0A53M4ETIBX0VOW390GRU&response_type=code&access_type=offline&redirect_uri=http://localhost:3000/server/crm_crud/generateToken';
}

function getUserDetails() {
    $("#main").hide();
    $("#connect").hide();
    catalyst.auth.isUserAuthenticated().then(result => {
        $("#loader").show();
        $.ajax({
            url: "/server/crm_crud/getUserDetails",
            type: "get",
            success: function (data) {
                $("#loader").hide();
                if (data.userId) {
                    $("#main").show();
                    role.setUserRole(result.content.role_details.role_name);
                    email.setUserEmail(result.content.email_id);
                    getModules();
                    getUserZohoID();
                    //checkModule();
                    console.log("Role => " + JSON.stringify(role));
                    console.log("Email => " + JSON.stringify(email));
                    $("#connect").hide();
                } else {
                    console.log("ADMINISTRATOR");
                    $("#connect").show();
                    $("#main").hide();
                }
            },
            error: function (error) {
                $("#myModalLabel").html("Failure");
                $("#message").html("Please try again after Sometime");
                $("#loader").hide();
                $('#myModal').modal('show');
            }
        });
    }).catch(err => {
        document.body.innerHTML = 'You are not logged in. Please log in to continue. Redirecting you to the login page..';
        setTimeout(function () {
            window.location.href = "login.html";
        }, 3000);
    });
}

function getUserZohoID() {
    //debugger;
    var tableContainer = document.getElementById("showData");
    tableContainer.innerHTML = "";
    $("#loaders").show();
    console.log("EMAIL ICI = " + email.userEmail);
    $.ajax({
        url: "/server/crm_crud/getUserZohoID/"+email.userEmail,
        type: "get",
        success: function (id) {
            debugger;
            zoho_id.setUserZohoID(id);
            $("#loaders").hide();
        },
        error: function (error) {
            $("#myModalLabel").html("Failure");
            $("#message").html("Please try again after Sometime");
            $("#loader").hide();
            $('#myModal').modal('show');
        }
    });
}


function showDeletePopup(leadID) {
    $('#ModalDanger').modal('show');
    var deleteBtn = document.getElementById("delete-btn");
    deleteBtn.value = leadID;
}

function showEditPopup(leadID) {
    console.log(leadID);
    $.ajax({
        url: "/server/crm_crud/crmData/" + leadID,
        type: "get",
        success: function (data) {
            //debugger;
            var respData = data.data;
            $('#editfirstName').val(respData[0].First_Name);
            $('#editlastName').val(respData[0].Last_Name);
            $('#editcompanyName').val(respData[0].Company);
            $('#editemail').val(respData[0].Email);
            $('#editstate').val(respData[0].State);
            $('#editphone').val(respData[0].Phone);
            $('#editleadSource').val(respData[0].Lead_Source);
            $('#editBtn').val(respData[0].id);

            $('#editfirstName').html(respData[0].First_Name);
            $('#editlastName').html(respData[0].Last_Name);
            $('#editcompanyName').html(respData[0].Company);
            $('#editemail').html(respData[0].Email);
            $('#editstate').html(respData[0].State);
            $('#editphone').html(respData[0].Phone);
            $('#editleadSource').html(respData[0].Lead_Source);

            $('#editForm').modal('show');
        },
        error: function (error) {
            $("#myModalLabel").html("Failure");
            $("#message").html("Please try again after Sometime");
            $("#loader").hide();
            $('#myModal').modal('show');
        }
    });
}

//Show records table 
function renderTable(module,respData,column) {
    $('#add').show();
    $('#cardBody').show();
    var add = document.getElementById("add");
    add.innerHTML = "Add " + module.innerHTML;
    add.setAttribute('onclick','getRecordsField('+module.id+')');
    column = column.Field;
    var col = [];
    if(column.length !== 0)
    {
        for(var i = 0; i < column.length; i++)
        {
            console.log(respData);
            for(var key in respData[0])
            {
                console.log(key);
                if(key ==column[i].Field.Field_name)
                {
                    col.push(key);
                }
            }
        }
    }   
    /*
    for (var i = 0; i < respData.length; i++) {
        for (var key in respData[i]) {
            if (col.indexOf(key) === -1) {
                if(column.length !== 0) {
                    console.log(column);
                    /*for(var i = 0; i < column.length; i++)
                    {
                        hideCol = column[i].Field.Field_name;
                        for(var j = 0; j < respData.length; j++)
                        {
                            delete respData[j][hideCol];
                        }
                        for(var j = 0; j < respData.length; j++)
                        {
                            col.push(hideCol);
                        }
                    }
                }
                //col.push(key);
            }
        }
    }*/
    var table = document.createElement("table");
    table.id = "dataTable";

    var tr = table.insertRow(-1);

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");
        var label = document.createElement("label");
        label.innerHTML = "<br>"+col[i];
        th.appendChild(label)
        tr.appendChild(th);
    }
    for (var i = 0; i < respData.length; i++) {

        tr = table.insertRow(-1);

        // Owner Email == current user email => show data

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            if(col[j] == "Owner")
            {
                tabCell.innerHTML = respData[i][col[j]].name;
            }
            else
            {
                tabCell.innerHTML = respData[i][col[j]];
            }
        }
    }
    var recordsTable = document.getElementById("table");
    recordsTable.replaceChild(table, recordsTable.firstElementChild);
    var moduleTable = document.getElementById("moduleTable");
    if(moduleTable !== null)
    {
        moduleTable.innerHTML = "";
    }
}

function HideShowColumn(col,module)
{
    var label = document.getElementById(col.id);
    var field = document.getElementById(label.htmlFor);
    console.log(field);
    if(field.checked)
    {
        $.ajax({
            url: "/server/crm_crud/record/"+col.id,
            type: "post",
            contentType: "application/json",
            data: JSON.stringify({
                "Column": col.id,
            }),
            success: function (data) {
                //debugger;
                console.log(data);
            },
            error: function (error) {
                console.log(error);
            }
        });
        getRecords(module);
    }
    else
    {
        $.ajax({
            url: "/server/crm_crud/record/"+field.className,
            type: "delete",
            contentType: "application/json",
            success: function (data) {
                //debugger;
                console.log(data);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
}

function checkField(module,field)
{
    $.ajax({
        url: "/server/crm_crud/record/checkColumn",
        type: "get",
        success: function (data) {
            //debugger;
            fieldTable(module,field,data);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function checkColumn(module,record)
{
    $.ajax({
        url: "/server/crm_crud/record/checkColumn",
        type: "get",
        success: function (data) {
            //debugger;
            renderTable(module,record,data);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getColumn(data) {

    var i;
    var resp = [];
    for (i = 0; i < data.length; i++) {
        var gulp = {
            "Field name": data[i].Field.Field_name,
            "id": data[i].Field.ROWID,
        }
        resp.push(gulp);
    }
    return resp;
}

/** Check/Hide/Show Module */
/*function checkModule()
{
    $.ajax({
        url: "/ser/crm_crud/record/checkModule",
        type: "get",
        success: function(data) {
            console.log(data);
        },
        error: function(error) {
            console.log(error);
        }
    })
}*/

function setModuleTable()
{
    ModuleTable(module.module);
}

function ModuleTable(module)
{
    $('#add').hide();
    $('#cardBody').show();
    var table = document.createElement("table");
    table.className = "table table-borderless";
    
    for(var i = 0; i < module.length; i++)
    {
        var tr = document.createElement("tr");
        var div = document.createElement("div");
        div.className = "switchToggle";
        div.setAttribute('style','width: 100%');
        var td = document.createElement("td");
        var h4 = document.createElement("h4");
        h4.innerHTML = module[i].Module;
        var label = document.createElement("label");
        label.innerHTML = module[i].Module;
        label.setAttribute('for',"switch"+i);
        //label.className = "form-check-label";
        var checkbox = document.createElement("input");
        checkbox.className = module[i].Module;
        checkbox.type = "checkbox";
        checkbox.setAttribute('onchange','');
        checkbox.id = "switch"+i;
        div.appendChild(h4); 
        div.appendChild(checkbox); 
        div.appendChild(label);
        td.appendChild(div);
        tr.appendChild(td);
        table.appendChild(tr);
        var div = document.getElementById("ModuleTable");
        div.replaceChild(table,div.firstElementChild);
    }
}