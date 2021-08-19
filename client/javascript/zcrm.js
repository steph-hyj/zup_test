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
            $("#loaders").hide();
            navBar(reqData);
            console.log(role.getUserRole());
            if(role.getUserRole().includes("Administrator"))
            {
                ModuleTable(reqData);
            }
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

/*function getRequiredData(data) {

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
}*/

/** CRM navbar */
function navBar(respData) 
{
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
        console.log(list);
        var bar = document.getElementById("navbar");
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
        var bar = document.getElementById("navbar");
        bar.appendChild(newList);
    }
}


/** Get All Records of module selected */
function getRecords(module) {
    //debugger;
    var tableContainer = document.getElementById("showData");
    tableContainer.innerHTML = "";
    $("#loaders").show();
    console.log(module);
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