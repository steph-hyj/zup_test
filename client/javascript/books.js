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

function navBooksBar() {
 
    for(var i = 1; i < 2; i++)
    {
        var ul = document.createElement("ul");
        ul.className = "nav nav-pills nav-fill";
        ul.id = "navbar";
        var list = document.createElement("li");
        list.className ="nav-item";
        var link = document.createElement("a");
        link.className = "nav-link";
        link.id = "Invoices";
        link.setAttribute('onclick','getAllInvoices()');
        link.innerHTML = "Invoices";
        list.appendChild(link);
        ul.appendChild(list);
        var bar = document.getElementById("navbarNavDropdown");
        bar.replaceChild(ul, bar.firstElementChild);
    }
}

function getAllInvoices() {
    $.ajax({
        url: "/server/crm_crud/books/invoices/getAllInvoices/"+orgID.orgID,
        type: "get",
        success: function (data) {
            debugger;
            $("#loaders").hide();
            renderBooksTable(data.invoices);
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
}