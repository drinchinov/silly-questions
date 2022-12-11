async function getFacepalms() {

    let response = await fetch("/api/facepalms", {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
    });

    let facepalms = await response.json();
    let rows = "";

    for (let facepalm of facepalms) {
        rows += row(facepalm);
    }

    const tbody = document.querySelector("tbody");
    tbody.insertAdjacentHTML("afterbegin", rows);
}

async function getFacepalm(id) {

    let response = await fetch("/api/facepalms/" + id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
    });

    let facepalm = await response.json();

    let form = document.forms["facepalmForm"];
    form.elements["id"].value = facepalm.id;
    form.elements["name"].value = facepalm.name;
    form.elements["issue"].value = facepalm.issue;
    form.elements["date"].value = facepalm.date;

}

async function createFacepalm(name, issue, date) {

    let response = await fetch("/api/facepalms", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({name, issue, date})
    });

    let facepalm = await response.json();
    facepalm.name = name;
    facepalm.issue = issue;
    facepalm.date = date;

    reset();

    let tbody = document.querySelector("tbody");
    tbody.insertAdjacentHTML("beforeend", row(facepalm));

}

async function editFacepalm(id, name, issue, date) {

    let response = await fetch("/api/facepalms", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({id, name, issue, date})
    });

    let facepalm = await response.json();

    reset();

    let tr = document.querySelector(`tr[data-rowid="${facepalm.id}"]`);
    tr.insertAdjacentHTML("beforebegin", row(facepalm));
    tr.remove();
}

async function deleteFacepalm(id) {

    let response = await fetch("/api/facepalms/" + id, {
        method: "DELETE",
        header: {
            "Content-Type": "application/json; charset=utf-8"
        }
    });

    let facepalm = await response.json();

    let tr = document.querySelector(`tr[data-rowid="${facepalm.id}"]`);
    tr.remove();
}


function reset() {

    let form = document.forms["facepalmForm"];
    form.reset();
    form.elements["id"].value = 0;
}

function row(facepalm) {

    return `<tr data-rowid="${facepalm.id}">
                  <td>${facepalm.id}</td>
                  <td>${facepalm.name}</td>
                  <td>${facepalm.issue}</td>
                  <td>${facepalm.date}</td>
                  <td>
                    <a class="editLink" data-id="${facepalm.id}">Изменить</a> |
                    <a class="removeLink" data-id="${facepalm.id}">Удалить</a>
                  </td>
                </tr>`
}

let resetBtn = document.getElementById("reset");

resetBtn.addEventListener("click", function(event) {

    event.preventDefault();
    reset();
});

let form = document.querySelector("form");

form.addEventListener("submit", function(event) {

    event.preventDefault();
    let id = this.elements["id"].value;
    let name = this.elements["name"].value;
    let issue = this.elements["issue"].value;
    let date = this.elements["date"].value;

    if (id == 0) {
        createFacepalm(name, issue, date);
    } else {
        editFacepalm(id, name, issue, date);
    }
});

document.body.addEventListener("click", function(event) {

    if (event.target.className != "editLink") return;

    let id = event.target.dataset.id;

    getFacepalm(id);
});

document.body.addEventListener("click", function(event) {

    if (event.target.className != "removeLink") return;

    let id = event.target.dataset.id;

    deleteFacepalm(id);
});

getFacepalms();