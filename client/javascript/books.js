var orgID = {
    orgID: "",
    getOrgID() {
        return this.orgID
    },

    setOrgID(orgID){
        this.orgID = orgID;
    }
}


function getOrganizationID(){
    $.ajax({
        url: "/server/crm_crud/books/getOrganizationID",
        type: "get",
        success: function (data) {
            debugger;
            $("#loaders").hide();
            orgID.setOrgID(data.organizations[0].organization_id);
            navBooksBar();
            console.log(orgID.orgID);
        },
        error: function (error) {
            $("#myModalLabel").html("Failure");
            $("#message").html("Please try again after Sometime");
            $("#loader").hide();
            $('#myModal').modal('show');
        }
    });
}

function navBooksBar() 
{
    /**Create Module option in navbar for admin */
    /*if(role.getUserRole().includes("Administrator"))
    {
        var list = document.createElement("li");
        list.className ="nav-item";
        var link = document.createElement("a");
        link.className = "nav-link";
        link.id = "Module";
        link.setAttribute('onclick','');
        link.innerHTML = "Module";
        list.appendChild(link);
        var bar = document.getElementById("navbarNavDropdown");
        bar.appendChild(list); 
    }*/
    var ul = document.createElement("ul");
    ul.className = "nav nav-pills nav-flush flex-sm-column flex-row flex-nowrap mb-auto mx-auto text-left align-items-left";
    ul.id = "navbar";
    var list = document.createElement("li");
    list.className ="nav-item";
    list.id = "booksModule";
    var link = document.createElement("a");
    link.className = "nav-link";
    link.className = "navbar-toggler fs-6";
    link.setAttribute('type','button');
    link.setAttribute('data-bs-toggle','collapse');
    link.setAttribute('data-bs-target','#navbar');
    link.setAttribute('aria-controls','navbar');
    link.setAttribute('aria-expanded','false');
    link.setAttribute('aria-label','Toggle navigation');
    link.id = "Invoices";
    link.innerHTML = "Invoices";
    if(role.getUserRole().includes("Administrator"))
    {
        var div = document.createElement("div");
        div.className = "collapse navbar-collapse";
        div.id = "navbar";
        var uList = document.createElement("ul");
        uList.className = "navbar-nav me-auto mb-2";
        var li = document.createElement("li");
        li.className ="nav-item";
        var a = document.createElement("a");
        a.className = "nav-link ms-4";
        a.setAttribute('data-bs-toggle','tooltip');
        a.setAttribute('data-bs-placement','right');
        a.setAttribute('data-bs-original-title','Invoices');
        a.innerHTML = "Set Up";
        a.setAttribute('onclick','setUpBooks()');
        var a1 = document.createElement("a");
        a1.className = "nav-link ms-4";
        a1.setAttribute('data-bs-toggle','tooltip');
        a1.setAttribute('data-bs-placement','right');
        a1.setAttribute('data-bs-original-title','Invoices');
        a1.setAttribute('onclick','getAllInvoices()');
        a1.innerHTML = "Records";
        li.appendChild(a);
        li.appendChild(a1);
        uList.appendChild(li);
        div.appendChild(uList);
        list.appendChild(link);
        list.appendChild(div);
    }
    else
    {
        link.setAttribute('onclick','getAllInvoices()');
        list.appendChild(link);
    }
    ul.appendChild(list);
    var bar = document.getElementById("navbarNavDropdown");
    bar.replaceChild(ul, bar.firstElementChild);
    var nav = document.getElementById("navbar2");
    if(nav !== null)
    {
        nav.innerHTML = "";
    }
}

function setUpBooks() {
    $.ajax({
        url: "/server/crm_crud/books/invoices/getAllInvoices/"+orgID.orgID,
        type: "get",
        success: function (data) {
            debugger;
            $("#loaders").hide();
            fieldBooksTable(data.invoices);
        },
        error: function (error) {
            $("#myModalLabel").html("Failure");
            $("#message").html("Please try again after Sometime");
            $("#loader").hide();
            $('#myModal').modal('show');
        }
    });
}

function getAllInvoices() {
    $.ajax({
        url: "/server/crm_crud/books/invoices/getAllInvoices/"+orgID.orgID,
        type: "get",
        success: function (data) {
            debugger;
            $("#loaders").hide();
            renderBooksTable(data.invoices);
        },
        error: function (error) {
            $("#myModalLabel").html("Failure");
            $("#message").html("Please try again after Sometime");
            $("#loader").hide();
            $('#myModal').modal('show');
        }
    });
}

/**Show field table */
function fieldBooksTable(respData)
{
    var col = [];
    console.log(respData);
    for(var key in respData[0])
    {
        col.push(key);
    }
    $('#add').hide();
    $('#cardBody').show();
    var field = respData.Field;
    var table = document.createElement("table");
    table.className = "table table-borderless";
    table.id = "moduleTable"
    for(var i = 1; i < col.length; i++)
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
        checkbox.setAttribute('onchange','');
        console.log(field);
        if(field !== undefined)
        {
            if(field.length !== 0)
            {
                for(var j = 0; j < field.length;j++)
                {                
                    if(col[i] == field[j].Field.Field_name)
                    {
                        checkbox.className = field[j].ROWID;
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

//Show table 
function renderBooksTable(respData) {
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
            checkbox.setAttribute('onchange','hideColumn('+col[i]+')');
            /*if(column.length !== 0)
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
            }*/
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
    var moduleTable = document.getElementById("moduleTable");
    if(moduleTable !== null)
    {
        moduleTable.innerHTML = "";
    }
}