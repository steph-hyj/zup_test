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

function logout() {
    var redirectURL = "http://localhost:3000/app/login.html"; //Add your app domain
    var auth = catalyst.auth;
    auth.signOut(redirectURL);
}

function navigate() {
    window.location.href = 'https://accounts.zoho.eu/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.settings.ALL,ZohoBooks.fullaccess.all&client_id=1000.IYF7J63XV0A53M4ETIBX0VOW390GRU&response_type=code&access_type=offline&redirect_uri=http://localhost:3000/server/crm_crud/generateToken';
}

function getUserDetailsProfile() {
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
                    getModulesProfile();
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
    var add = document.getElementById("add");
    add.innerHTML = "Add " +module.id;
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
            if(key.includes("_Phone")|| key.includes("Currency") || key.includes("id") || key.includes("Score") || key.includes("$") || key.includes("_Time") || key.includes("clientportalplugin") || key.includes("Last_Name") || key.includes("First_Name") || key.includes("Image") || key.includes("Rate"))
            {
                delete respData[i][key];
            }
        }
        for (var key in respData[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }
    var table = document.createElement("table");
    table.id = "dataTable";

    var tr = table.insertRow(-1);

    console.log(col);

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

function ModuleTable(module)
{
    var counter = 0;
    //var ul = null;
    var tr = document.createElement("tr");
    var table = document.createElement("table");
    table.className = "table table-borderless";
    for(var i = 0; i < module.length; i++)
    {
        if(counter > 10 && i < module.length)
        {
            //ul = document.createElement("ul");
            //ul.className = "list-group list-group-horizontal";
            var tr = document.createElement("tr");
        }
        /*var li = document.createElement("li");
        li.className = "list-group-item";
        var label = document.createElement("label");
        label.innerHTML = "<br>"+module[i].Module;   
        li.appendChild(label);*/
        var td = document.createElement("td");
        td.setAttribute("scope","col");
        var label = document.createElement("label");
        label.innerHTML = module[i].Module;   
        
        var checkbox = document.createElement("input");
        checkbox.className = "form-check-input me-1";
        checkbox.value="";
        checkbox.setAttribute('aria-label','...');
        checkbox.type = "checkbox";
        checkbox.setAttribute('onchange','');
        //li.appendChild(checkbox);
        td.appendChild(checkbox);
        td.appendChild(label);
        tr.appendChild(td);
        table.appendChild(tr);
        var div = document.getElementById("module");
        div.appendChild(table);
        if(counter > 10)
        {
            counter = 0;
        }
        else
        {
            counter += 1;
        }
        /*if(ul !== null)
        {
            ul.appendChild(li);
            var moduleTable = document.getElementById("module");
            moduleTable.appendChild(ul);
            if(counter > 10)
            {
                counter = 0;
            }
            else
            {
                counter += 1;
            }
        }
        else
        {
            var moduleTable = document.getElementById("listModule");
            moduleTable.appendChild(li);
            counter += 1;
        }*/       
    }
}

//////////////////////// PROFILE /////////////////////////

function navbarProfile(respData) 
{
    for(var i = 1; i < respData.length; i++)
    {
        var list = document.createElement("li");
        list.className ="nav-item";
        var link = document.createElement("a");
        link.className = "nav-link";
        link.id = respData[i].api_name;
        link.setAttribute('onclick','getRecordsProfile('+respData[i].api_name+')');
        link.innerHTML = respData[i].Module;
        list.appendChild(link);
        console.log(list);
        var bar = document.getElementById("navbarProfile");
        if(i == 1)
        {
           bar.replaceChild(list,bar.firstElementChild); 
        }
        else
        {
            bar.appendChild(list); 
        }
        if(i > 14)
        {
            break;
        }
    }
    if(i <= respData.length)
    {
        var newList = document.createElement("li");
        newList.className = "nav-item dropdown";
        var a = document.createElement("a");
        a.className ="nav-link dropdown-toggle";
        a.href = "#";
        a.role = "button";
        a.setAttribute("data-toggle","dropdown");
        a.setAttribute("aria-haspopup","true");
        a.setAttribute("aria-expanded","false");
        a.setAttribute("style","padding-left: 10%;");
        var span = document.createElement("span");
        span.innerHTML = "...";
        a.appendChild(span);
        newList.appendChild(a);
        var div = document.createElement("div");
        div.className = "dropdown-menu";
        div.setAttribute("aria-labelledby", "navbarDropdownMenuLink");
        div.id = "dropdown-menu";
        for(var i = i+1; i < respData.length;i++)
        {
            var otherModule = document.createElement("a");
            otherModule.className = "dropdown-item";
            otherModule.href = "#";
            otherModule.innerHTML = respData[i].Module;
            div.prepend(otherModule);
        }
        newList.appendChild(div);
        var bar = document.getElementById("navbarProfile");
        bar.appendChild(newList);
    }
}

// function navbarProfile(respData) {
 
//     for(var i = 1; i < respData.length; i++)
//     {
//         var list = document.createElement("li");
//         list.className ="nav-item";
//         var link = document.createElement("a");
//         link.className = "nav-link";
//         link.id = respData[i].api_name;
//         link.setAttribute('onclick','getRecordsProfile('+respData[i].api_name+')');
//         link.innerHTML = respData[i].Module;
//         list.appendChild(link);
//         var bar = document.getElementById("navbarProfile");
//         bar.appendChild(list);
//         if(i > 14)
//         {
//             break;
//         }
//     }
//     if(i <= respData.length)
//     {
//         for(var i = i+1; i < respData.length;i++)
//         {
//             $("#navbarDropdownMenuLink").show();
//             var otherModule = document.createElement("a");
//             otherModule.className = "dropdown-item";
//             otherModule.href = "#";
//             otherModule.innerHTML = respData[i].Module;
//             var list = document.getElementById("dropdown-menu")
//             list.prepend(otherModule);
//         }
//     }
// }

function getRecordsProfile(module) {
    //debugger;
    var tableContainer = document.getElementById("showData");
    tableContainer.innerHTML = "";
    $("#loaders").show();
    console.log(module.id);
    if(role.userRole.includes("User"))
    {
        $.ajax({
            url: "/server/crm_crud/module/"+module.id+"/"+zoho_id.userZohoID,
            type: "get",
            success: function (data) {
                debugger;
                $("#loaders").hide();
                //renderTable(data.data);
                checkColumnProfile(module,data.data);
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
                checkColumnProfile(module,data.data);
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

function hideColumnProfile(col,module)
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
        getRecordsProfile(module);
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

function renderTableProfile(module,respData,column) {
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
            checkbox.setAttribute('onchange','hideColumnProfile('+col[i]+','+module.id+')');
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
            tabCell.innerHTML = JSON.stringify(respData[i][col[j]]);
            // tabCell.innerHTML = respData[i][col[j]];
        }
    }
    var recordsTable = document.getElementById("main");
    recordsTable.replaceChild(table, recordsTable.firstElementChild);
}

function checkColumnProfile(module,record)
{
    $.ajax({
        url: "/server/crm_crud/record/checkColumn",
        type: "get",
        success: function (data) {
            //debugger;
            renderTableProfile(module,record,data);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getModulesProfile() {
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
            navbarProfile(reqData);
        },
        error: function (error) {
            $("#myModalLabel").html("Failure");
            $("#message").html("Please try again after Sometime");
            $("#loader").hide();
            $('#myModal').modal('show');
        }
    });
}

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