var timeoutID;
var timeout = 1000;

function setup() {
	document.getElementById("theButton").addEventListener("click", addTodo, true);
	document.getElementById("theButton2").addEventListener("click", addPurchase, true);
	poller();
	poller2();
}

function makeReq(method, target, retCode, action, data) {
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}

	httpRequest.onreadystatechange = makeHandler(httpRequest, retCode, action);
	httpRequest.open(method, target);
	
	if (data){
		httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		httpRequest.send(data);
	}
	else {
		httpRequest.send();
	}
}

function makeHandler(httpRequest, retCode, action) {
	function handler() {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			if (httpRequest.status === retCode) {
				console.log("recieved response text:  " + httpRequest.responseText);
				action(httpRequest.responseText);
			} else {
				alert("There was a problem with the request.  you'll need to refresh the page!");
			}
		}
	}
	return handler;
}

function addTodo() {
	var newDo = document.getElementById("newDo").value
	var newDo2 = document.getElementById("newDo4").value
	var data;
	data = "category=" + newDo + "&amount=" + newDo2;
	
	makeReq("POST", "/cats", 201, poller, data);
	document.getElementById("newDo").value = "";
	
}

function addPurchase() {
	var newDo = document.getElementById("newDo2").value;
	var newDo2 = document.getElementById("newDo3").value;
	var data;
	data = "purchase=" + newDo + "&category=" + newDo2;
	
	makeReq("POST", "/purchases", 201, poller2, data);
	document.getElementById("newDo2").value = "";
	
}

function poller() {
	makeReq("GET", "/cats", 200, repopulate);
}

function poller2() {
	makeReq("GET", "/purchases", 200, repopulate2);
}

function deleteTodo(taskID) {
	makeReq("DELETE", "/cats/" + taskID, 204, poller);
}


function addCell(row, text) {
	var newCell = row.insertCell();
	var newText = document.createTextNode(text);
	newCell.appendChild(newText);
}

function repopulate(responseText) {
	console.log("repopulating!");
	var todos = JSON.parse(responseText);
	var tab = document.getElementById("theTable");
	var newRow, newCell, t, task, newButton, newDelF;

	while (tab.rows.length > 0) {
		tab.deleteRow(0);
	}
			
	for (t in todos) {
		newRow = tab.insertRow();
		addCell(newRow, t);
		addCell(newRow, "Remaining Budget = $" + todos[t]);
		
		newCell = newRow.insertCell();
		newButton = document.createElement("input");
		newButton.type = "button";
		newButton.value = "Delete " + t;
		(function(_t){ newButton.addEventListener("click", function() { deleteTodo(_t); }); })(t);
		newCell.appendChild(newButton);
	}

	
}

function repopulate2(responseText) {
	console.log("repopulating!");
	var todos = JSON.parse(responseText);
	var tab = document.getElementById("theTable2");
	var newRow, newCell, t, task, newButton, newDelF;

	while (tab.rows.length > 0) {
		tab.deleteRow(0);
	}
			
	for (t in todos) {
		newRow = tab.insertRow();
		addCell(newRow, todos[t]);
		
		addCell(newRow, "Dollars spent on: " + t);
		
	}

	poller();
}

window.addEventListener("load", setup, true);
