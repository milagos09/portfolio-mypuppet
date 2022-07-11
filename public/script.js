const socket = io();
const url = document.querySelector("#url");
const headless = document.querySelector("#headless");
const logs = document.getElementById("logs");

var a = { method: "type", params: ["input", "stackoverflow"] };
var b = { method: "waitForTimeout", params: ["200"] };
var c = { method: "click", params: [`input[name="btnK"]`] };
var c2 = { method: "waitForNavigation", params: [] };
var d = { method: "$$eval", params: ["h3"] };

restoreSettings();
/**
 * It sends a POST request to the server with the URL, headless boolean, and iterations array
 */
function start() {
    logs.innerHTML = "";
    socket.emit("start", {
        url: url.value,
        headless: headless.checked,
        iterations: saveIterations(false),
    });
}

/**
 * It creates a new list item, adds a select element with options to it, and then adds an input element
 * to it.
 */
function addIteration(method = "type", params = "") {
    const ol = document.querySelector("ol");
    const li = document.createElement("li");
    const select = document.createElement("select");
    const input = document.createElement("input");
    const close = document.createElement("button");
    const options = [
        "type",
        "click",
        "waitForTimeout",
        "waitForSelector",
        "select",
        "$eval",
        "$$eval",
        "extractTable",
        "clearInput",
        "close",
    ];

    for (const option of options) {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        select.append(opt);
    }
    select.value = method;
    li.append(select);
    input.placeholder = "parameter/s";
    input.value = params;
    input.type = "text";
    li.append(input);
    close.textContent = "x";
    close.onclick = deleteIteration;
    li.append(close);
    ol.append(li);
}

function deleteIteration() {
    this.parentElement.remove();
}

function saveIterations(save = true) {
    const li = Array.from(document.querySelectorAll("li"));
    const iterations = li.map((e) => {
        const method = e.querySelector("select").value;
        const params = e.querySelector("input").value.trim().split(",");

        return { method, params };
    });
    save &&
        localStorage.setItem("settings", JSON.stringify({ url: url.value, headless: headless.checked, iterations }));

    return iterations;
}

function reset() {
    const li = document.querySelectorAll("li");

    for (const list of li) {
        list.remove();
    }
}

function restoreSettings() {
    if (localStorage.getItem("settings")) {
        const { url, headless, iterations } = JSON.parse(localStorage.getItem("settings"));
        document.getElementById("url").value = url;
        document.getElementById("headless").checked = headless;
        iterations.forEach((e) => {
            addIteration(e.method, e.params);
        });
    }
}

socket.on("logs", (data) => {
    console.log(data);
    const p = document.createElement("p");
    p.innerText = data;
    logs.append(p);
});

socket.on("download", (data) => {
    const format = document.querySelector('input[name="format"]:checked').value;
    const a = document.createElement("a");
    const logs = document.querySelector("#logs");
    // const encodedUri = encodeURI(`data:text/${format.value};charset=utf-8,` + data);
    // window.open(encodedUri);
    const file = new Blob([data]);
    a.download = Date.now().toString(16) + "." + format;
    a.innerHTML = "Download";
    a.href = URL.createObjectURL(file);

    logs.append(a);
});
