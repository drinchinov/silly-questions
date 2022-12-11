const express = require("express");
const fs = require("fs");

const app = express();
const jsonParser = express.json();
const filePath = "facepalms.json";

app.use(express.static(__dirname + "/public"));

app.get("/api/facepalms", (req, res) => {

    let content = fs.readFileSync(filePath, "utf8");
    let facepalms = JSON.parse(content);

    res.send(facepalms);
});

app.get("/api/facepalms/:id", (req, res) => {

    const id = req.params.id;
    const content = fs.readFileSync(filePath, "utf8");
    const facepalms = JSON.parse(content);

    const facepalm = facepalms.find(obj => obj.id == id);

    facepalm ? res.send(facepalm) : res.status(404).send("Facepalm isn't found by ID");
});

app.post("/api/facepalms", jsonParser, (req, res) => {

    if (!req.body) return res.sendStatus(400);

    const {name, issue, date} = req.body;

    let content = fs.readFileSync(filePath, "utf8");
    let facepalms = JSON.parse(content);
    let facepalm;

    const id = Math.max(...facepalms.map(obj => obj.id)) + 1;


    Number.isFinite(id) ? facepalm = {id, name, issue, date} : facepalm = {id: 1, name, issue, date};

    facepalms.push(facepalm);
    content = JSON.stringify(facepalms);
    fs.writeFileSync(filePath, content);

    res.send(facepalm);
});

app.delete("/api/facepalms/:id", (req, res) => {

    const id = req.params.id;

    let content = fs.readFileSync(filePath, "utf8");
    let facepalms = JSON.parse(content);
    const foundId = facepalms.findIndex(obj => obj.id == id);

    if (foundId) {
        const facepalm = facepalms.splice(foundId, 1)[0];
        content = JSON.stringify(facepalms);
        fs.writeFileSync(filePath, content);
        res.send(facepalm);
    } else {
        res.status(404).send("Facepalm isn't found by ID");
    }

});

app.put("/api/facepalms", (req, res) => {

    if (!req.body) return res.sendStatus(400);

    const {id, name, issue, date} = req.body;

    let content = fs.readFileSync(filePath, "utf8");
    let facepalms = JSON.parse(content);

    const facepalm = facepalms.find(obj => obj.id == id);

    if (facepalm) {
        facepalm.name = name;
        facepalm.issue = issue;
        facepalm.date = date;
        content = JSON.stringify(facepalms);
        fs.writeFileSync(filePath, content);
        res.send(facepalm);
    } else {
        res.status(404).send("Facepalm isn't found by ID");
    }
});

app.listen(3000, () => console.log("Server is running..."));