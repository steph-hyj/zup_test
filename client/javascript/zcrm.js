/*Get All CRM Module*/ 
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
            module.setModule(reqData);
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


//Get all module to set CRM navbar
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

/** CRM navbar */
function navBar(respData) 
{
    /**Create Module option in navbar for admin */
    var ul = document.createElement("ul");
    ul.className = "nav nav-pills nav-flush flex-sm-column flex-row flex-nowrap mb-auto mx-auto text-left align-items-left";
    ul.id = "navbar";
    if(role.getUserRole().includes("Administrator"))
    {
        var zCrm = document.createElement("li");
        zCrm.className ="nav-item";
        //zCrm.style = "padding:5%";
        var link = document.createElement("a");
        link.className = "navbar-toggler fs-6";
        link.setAttribute('type','button');
        link.setAttribute('data-bs-toggle','collapse');
        link.setAttribute('data-bs-target','#navbar'+"zCrm");
        link.setAttribute('aria-controls','navbar'+"zCrm");
        link.setAttribute('aria-expanded','false');
        link.setAttribute('aria-label','Toggle navigation');
        link.id = "zCrm";
        link.innerHTML = "Zoho CRM";
        var zCrmDiv = document.createElement("div");
        zCrmDiv.className = "collapse navbar-collapse";
        zCrmDiv.id = "navbar"+"zCrm";
        var zCrmList = document.createElement("ul");
        zCrmList.className = "navbar-nav me-auto mb-2";
        var li = document.createElement("li");
        li.className ="nav-item";
        var a = document.createElement("a");
        a.className = "nav-link ms-4";
        a.setAttribute('data-bs-toggle','tooltip');
        a.setAttribute('data-bs-placement','right');
        a.setAttribute('data-bs-original-title',"zCrm");
        a.innerHTML = "Module";
        a.setAttribute('onclick','setModuleTable()');
        li.appendChild(a);
        zCrmList.appendChild(li);
        zCrmDiv.appendChild(zCrmList);
        zCrm.appendChild(link);
        zCrm.appendChild(zCrmDiv);
    }

    for(var i = 1; i < respData.length; i++)
    {
        var list = document.createElement("li");
        list.className ="nav-item";
        //list.style = "padding:5%";
        var link = document.createElement("a");
        link.className = "navbar-toggler fs-6";
        link.setAttribute('type','button');
        link.setAttribute('data-bs-toggle','collapse');
        link.setAttribute('data-bs-target','#navbar'+respData[i].api_name);
        link.setAttribute('aria-controls','navbar'+respData[i].api_name);
        link.setAttribute('aria-expanded','false');
        link.setAttribute('aria-label','Toggle navigation');
        link.id = respData[i].api_name;
        //link.setAttribute('onclick','getRecords('+respData[i].api_name+')');
        link.innerHTML = respData[i].Module;
        if(role.getUserRole().includes("Administrator"))
        {
            var div = document.createElement("div");
            div.className = "collapse navbar-collapse";
            div.id = "navbar"+respData[i].api_name;
            var uList = document.createElement("ul");
            uList.className = "navbar-nav me-auto mb-2";
            var li = document.createElement("li");
            li.className ="nav-item";
            var a = document.createElement("a");
            a.className = "nav-link ms-4";
            a.setAttribute('data-bs-toggle','tooltip');
            a.setAttribute('data-bs-placement','right');
            a.setAttribute('data-bs-original-title',respData[i].api_name);
            a.innerHTML = "Set Up";
            a.setAttribute('onclick','setUp('+respData[i].api_name+')');
            var a1 = document.createElement("a");
            a1.className = "nav-link ms-4";
            a1.setAttribute('data-bs-toggle','tooltip');
            a1.setAttribute('data-bs-placement','right');
            a1.setAttribute('data-bs-original-title',respData[i].api_name);
            a1.setAttribute('onclick','getRecords('+respData[i].api_name+')');
            a1.innerHTML = "Records";
            li.appendChild(a);
            li.appendChild(a1);
            uList.appendChild(li);
            div.appendChild(uList);
            list.appendChild(link);
            list.appendChild(div);
            zCrmList.appendChild(list);
            ul.appendChild(zCrm);
        }
        else
        {
            link.setAttribute('onclick','getRecords('+respData[i].api_name+')');
            list.appendChild(link);
            ul.appendChild(link);
        }
        if(i > 14)
        {
            break;
        }
    }
    var bar = document.getElementById("navbarNavDropdown");
    bar.replaceChild(ul, bar.firstElementChild);
    var ul = document.createElement("ul");
    ul.className = "nav nav-pills nav-flush flex-sm-column flex-row flex-nowrap mb-auto mx-auto text-left align-items-left";
    ul.id = "navbar2";
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
    }
    ul.appendChild(newList);
    var bar = document.getElementById("navbarNavDropdown");
    bar.replaceChild(ul, bar.lastElementChild);
    var records = document.getElementById("dataTable");
    if(records !== null)
    {
        records.innerHTML ="";
    }
    var moduleTable = document.getElementById("moduleTable");
    if(moduleTable !== null)
    {
        moduleTable.innerHTML = "";
    }
}

/** Get Field to set a form */
function getRecordsField(module) {
    //debugger;
    var tableContainer = document.getElementById("showData");
    tableContainer.innerHTML = "";
    $("#loaders").show();
    $.ajax({
        url: "/server/crm_crud/module/"+module.id+"/"+email.userEmail,
        type: "get",
        success: function (data) {
            debugger;
            $("#loaders").hide();
            //renderTable(data.data);
            //checkColumn(module,data.data);
            setForms(data.data);
            console.log(data);
        },
        error: function (error) {
            $("#myModalLabel").html("Failure");
            $("#message").html("Please try again after Sometime");
            $("#loader").hide();
            $('#myModal').modal('show');
        }
    });
}
/** Get All Records of module selected */
function getRecords(module) {
    //debugger;
    var tableContainer = document.getElementById("showData");
    tableContainer.innerHTML = "";
    $("#loaders").show();
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
/** Get All Fields of each records*/
function setUp(module) {
    //debugger;
    var tableContainer = document.getElementById("showData");
    tableContainer.innerHTML = "";
    console.log(module);
    $("#loaders").show();
    $.ajax({
        url: "/server/crm_crud/module/"+module.id,
        type: "get",
        success: function (data) {
            debugger;
            $("#loaders").hide();
            //renderTable(data.data);
            checkField(module,data.data);
            //fieldTable(data.data);
            console.log(data);
        },
        error: function (error) {
            $("#myModalLabel").html("Failure");
            $("#message").html("Please try again after Sometime");
            $("#loader").hide();
            $('#myModal').modal('show');
        }
    });
}

/**Create list of field */
function fieldTable(module,field,respData)
{
    var col = [];
    for(var key in field[0])
    {
        col.push(key);
    }
    $('#add').hide();
    $('#cardBody').show();
    var field = respData.Field;
    var table = document.createElement("table");
    table.className = "table table-borderless";
    table.id = "moduleTable"
    for(var i = 0; i < col.length; i++)
    {
        var tr = document.createElement("tr");
        var div = document.createElement("div");
        div.className = "switchToggle";
        div.setAttribute('style','width: 100%');
        var td = document.createElement("td");
        var h6 = document.createElement("h6");
        h6.innerHTML = col[i];
        var label = document.createElement("label");
        label.innerHTML = col[i];
        label.id = col[i];
        label.setAttribute('for',"switch"+i);
        //label.className = "form-check-label";
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "switch"+i;
        checkbox.setAttribute('onchange','HideShowColumn('+col[i]+','+module.id+')');
        if(field !== undefined)
        {
            if(field.length !== 0)
            {
                for(var j = 0; j < field.length;j++)
                {                
                    if(col[i] == field[j].Field.Field_name)
                    {
                        checkbox.className = field[j].Field.ROWID;
                        checkbox.setAttribute('checked','checked');
                    }
                }
            }
        }
        div.appendChild(h6); 
        div.appendChild(checkbox); 
        div.appendChild(label);
        td.appendChild(div);
        tr.appendChild(td);
        table.appendChild(tr);
        var div = document.getElementById("ModuleTable");
        div.replaceChild(table,div.firstElementChild);
        var records = document.getElementById("dataTable");
        if(records !== null)
        {
            records.innerHTML ="";
        }
    }
}
/*Create Record */
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

/** Get all Deals */
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

/** Delete record selected */
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

/** Edit record selected */
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

/**Set Form to add records */
function setForms(data)
{
    var col = [];

    for(var i = 0; i <data.length;i++)
    {
        for(var key in data[i])
        {
            if (col.indexOf(key) === -1) 
            {
                if(!key.includes("$"))
                {
                    if(!key.includes("clientportal"))
                    {
                        if(!key.includes("id"))
                        {
                             col.push(key); 
                        }
                    }
                }
            }
        }
    }
    var modalBody = document.getElementById("modalBody");
    for(var i = 0;i < col;i++)
    {
        var div = document.createElement("div");
        div.className = "mb-3";
        var label = document.createElement("label");
    }
    
    
    console.log(col);
}