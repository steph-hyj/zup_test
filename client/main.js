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

function profile() {
    window.location.href = "profile.html"; //Add your app domain
}

function createLead() {
    //debugger;
    $("#loader").show();
    var firstName = $("#firstName").val();
    var lastName = $("#lastName").val();
    if (lastName == "") {
        alert("Kindly Enter the Last Name");
        $("#loader").hide();
        return;
    }
    var companyName = $("#companyName").val();
    var email = $("#email").val();
    var state = $("#state").val();
    var phone = $("#phone").val();
    var leadSource = $("#leadSource").val();

    $.ajax({
        url: "/server/crm_crud/crmData",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            "First_Name": firstName,
            "Last_Name": lastName,
            "Company": companyName,
            "Email": email,
            "State": state,
            "Phone": phone,
            "Lead_Source": leadSource,
        }),
        success: function (data) {
            //debugger;
            $('#leads').trigger("reset");
            $("#myModalLabel").html("Success");
            $("#message").html("Lead Created Successfully");
            $("#loader").hide();
            $('#myModal').modal('show');
        },
        error: function (error) {
            $('#leads').trigger("reset");
            $("#myModalLabel").html("Failure");
            $("#message").html("Please try again after Sometime");
            $("#loader").hide();
            $('#myModal').modal('show');
        }
    });
}

function logout() {
    var redirectURL = "http://localhost:3000/app/login.html"; //Add your app domain
    var auth = catalyst.auth;
    auth.signOut(redirectURL);
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

function getRecords(module) {
    //debugger;
    var tableContainer = document.getElementById("showData");
    tableContainer.innerHTML = "";
    $("#loaders").show();
    console.log(module.id);
    if(role.userRole.includes("User"))
    {
        $.ajax({
            url: "/server/crm_crud/module/"+module.id+"/"+email.userEmail,
            type: "get",
            success: function (data) {
                debugger;
                $("#loaders").hide();
                //renderTable(data.data);
                checkColumn(module,data.data);
            },
            error: function (error) {
                $("#myModalLabel").html("Failure");
                $("#message").html("Please try again after Sometime");
                $("#loader").hide();
                $('#myModal').modal('show');
            }
        });
    }
    else
    {
        $.ajax({
            url: "/server/crm_crud/module/"+module.id,
            type: "get",
            success: function (data) {
                debugger;
                $("#loaders").hide();
                //renderTable(data.data);
                checkColumn(module,data.data);
            },
            error: function (error) {
                $("#myModalLabel").html("Failure");
                $("#message").html("Please try again after Sometime");
                $("#loader").hide();
                $('#myModal').modal('show');
            }
        });
    }
}

function getListDeals() {
    //debugger;
    var tableContainer = document.getElementById("showData");
    tableContainer.innerHTML = "";
    $("#loaders").show();
    // console.log(module.id);

    $.ajax({
        url: "/server/crm_crud/list/getListDeals/"+zoho_id.userZohoID,
        type: "get",
        success: function (data) {
            debugger;
            $("#loaders").hide();
            console.log("data => " + JSON.stringify(data));
            checkColumn("Deals",data.data);
        },
        error: function (error) {
            $("#myModalLabel").html("Failure");
            $("#message").html("Please try again after Sometime");
            $("#loader").hide();
            $('#myModal').modal('show');
        }
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

function getLeads() {
    //debugger;
    var tableContainer = document.getElementById("showData");
    tableContainer.innerHTML = "";
    $("#loaders").show();
    $.ajax({
        url: "/server/crm_crud/crmData",
        type: "get",
        success: function (data) {
            //debugger;
            var reqData = getRequiredData(data.data);
            $("#loaders").hide();
            renderTable(reqData);
        },
        error: function (error) {
            $("#myModalLabel").html("Failure");
            $("#message").html("Please try again after Sometime");
            $("#loader").hide();
            $('#myModal').modal('show');
        }
    });
}

function getModules() {
    //debugger;
    var tableContainer = document.getElementById("showData");
    tableContainer.innerHTML = "";
    $("#loaders").show();
    $.ajax({
        url: "/server/crm_crud/module",
        type: "get",
        success: function (data) {
            //debugger;
            console.log(data.modules);
            var reqData = getModuleData(data.modules);
            $("#loaders").hide();
            navBar(reqData);
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

function deleteLead() {
    var leadID = document.getElementById('delete-btn').value;
    $.ajax({
        url: "/server/crm_crud/crmData/" + leadID,
        type: "delete",
        success: function (data) {
            //debugger;
            $('#ModalDanger').modal('toggle');
            $("#myModalLabel").html("Success");
            $("#message").html("Lead Deleted Successfully");
            $('#myModal').modal('show');
            setTimeout(function () {
                location.reload();
            }, 3000);
        },
        error: function (error) {
            $("#myModalLabel").html("Failure");
            $("#message").html("Please try again after Sometime");
            $("#loader").hide();
            $('#myModal').modal('show');
        }
    });
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

function editLead() {
    var firstName = $("#editfirstName").val();
    var lastName = $("#editlastName").val();
    if (lastName == "") {
        alert("Kindly Enter the Last Name");
        return;
    }
    var companyName = $("#editcompanyName").val();
    var email = $("#editemail").val();
    var state = $("#editstate").val();
    var phone = $("#editphone").val();
    var leadSource = $("#editleadSource").val();
    var leadID = $("#editBtn").val();

    $.ajax({
        url: "/server/crm_crud/crmData/" + leadID,
        type: "put",
        contentType: "application/json",
        data: JSON.stringify({
            "First_Name": firstName,
            "Last_Name": lastName,
            "Company": companyName,
            "Email": email,
            "State": state,
            "Phone": phone,
            "Lead_Source": leadSource
        }),
        success: function (data) {
            //debugger;
            $('#editForm').modal('toggle');
            $("#myModalLabel").html("Success");
            $("#message").html("Lead Edited Successfully");
            $('#myModal').modal('show');
            setTimeout(function () {
                location.reload();
            }, 3000);
        },
        error: function (error) {
            $('#leads').trigger("reset");
            $("#myModalLabel").html("Failure");
            $("#message").html("Please try again after Sometime");
            $("#loader").hide();
            $('#myModal').modal('show');
        }
    });

}

//Get all module to set navbar
function getModuleData(data) {

    var i;
    var resp = [];
    for (i = 0; i < data.length; i++) {
        var gulp = {
            "Module": data[i].singular_label,
            "api_name": data[i].api_name
        }
        resp.push(gulp);
    }
    console.log(resp);
    return resp;
}

function getRequiredData(data) {

    var i;
    var resp = [];
    for (i = 0; i < data.length; i++) {
        var gulp = {
            "First Name": data[i].First_Name,
            "Last Name": data[i].Last_Name,
            "Phone": data[i].Phone,
            "Email": data[i].Email,
            "Company": data[i].Company,
			"Edit": `<center><a href="javascript:showEditPopup(&quot;` + data[i].id + `&quot;)">&#9998;︎</a></center>`,
            "Delete": `<center><a href="javascript:showDeletePopup(&quot;` + data[i].id + `&quot;)">&#128465;︎</a></center>`
        }
        resp.push(gulp);
    }
    console.log(resp);
    return resp;
}

function navBar(respData) {
 
    for(var i = 1; i < respData.length; i++)
    {
        var list = document.createElement("li");
        list.className ="nav-item";
        var link = document.createElement("a");
        link.className = "nav-link";
        link.id = respData[i].api_name;
        link.setAttribute('onclick','getRecords('+respData[i].api_name+')');
        link.innerHTML = respData[i].Module;
        list.appendChild(link);
        var bar = document.getElementById("navbar");
        bar.appendChild(list);
        if(i > 14)
        {
            break;
        }
    }
    if(i <= respData.length)
    {
        for(var i = i+1; i < respData.length;i++)
        {
            $("#navbarDropdownMenuLink").show();
            var otherModule = document.createElement("a");
            otherModule.className = "dropdown-item";
            otherModule.href = "#";
            otherModule.innerHTML = respData[i].Module;
            var list = document.getElementById("dropdown-menu")
            list.prepend(otherModule);
        }
    }
}

//Show table 
function renderTable(module,respData,column) {
    column = column.Field;
    if(role.userRole.includes("User"))
    {
        if(column.length !== 0)
        {
            for(var i = 0; i < column.length; i++)
            {
                console.log(column[i].Field.Field_name);
                hideCol = column[i].Field.Field_name;
                for(var j = 0; j < respData.length; j++)
                {
                    delete respData[j][hideCol];
                    console.log(respData[j]);
                }
            }
        }   
    }
    var col = [];
    for (var i = 0; i < respData.length; i++) {
        for (var key in respData[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }
    var table = document.createElement("table");
    table.id = "dataTable";

    var tr = table.insertRow(-1);

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");
        if(role.userRole.includes("Administrator"))
        {
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = col[i];
            checkbox.setAttribute('onchange','hideColumn('+col[i]+','+module.id+')');
            if(column.length !== 0)
            {
                for(var j = 0; j < column.length; j++)
                {
                    if(col[i] == column[j].Field.Field_name)
                    {
                        checkbox.className = column[j].Field.ROWID;
                        checkbox.setAttribute('checked','checked');
                        console.log(checkbox);
                    }
                }   
            }
            th.appendChild(checkbox);    
        }
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
            tabCell.innerHTML = respData[i][col[j]];
        }
    }
    var recordsTable = document.getElementById("main");
    recordsTable.replaceChild(table, recordsTable.firstElementChild);
}

function hideColumn(col,module)
{
    var field = document.getElementById(col.id);
    console.log(field);
    if(field.checked)
    {
        console.log(col.id);
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
            url: "/server/crm_crud/record/"+col.className,
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