const puppeteer = require("puppeteer");

module.exports = async function (url, headless = true, iterations, socket) {
    /* Checking if the url is empty or not. If it is empty, it will return. */
    if (!url) return;

    let tableData;
    const browser = await puppeteer.launch({ headless: headless });
    const page = await browser.newPage();
    await page["goto"](url);

    let count = 1;
    for (const i of iterations) {
        params = i.params.map((e) => e.trim());

        switch (i.method.trim()) {
            case "$$eval":
                console.log(await page.$$eval(...params, (e) => e.map((f) => f.innerText)));
                break;
            case "$eval":
                console.log(await page.$eval(...params, (e) => e.map((f) => f.textContent)));
                break;
            case "extractTable":
                tableData = await page.evaluate(() => {
                    const table = document.querySelector("table");
                    const th = Array.from(table.querySelectorAll("th")).map((e) => e.textContent);
                    const td = Array.from(table.querySelectorAll("td")).map((e) => e.textContent);

                    const merge = [];
                    merge.push(th);

                    for (let i = 0; i < td.length / th.length; i++) {
                        merge.push(td.splice(0, th.length));
                    }

                    const rows = merge.map((row) => row.toString());
                    let tableData = "";
                    rows.forEach((row) => (tableData += row + "\n"));
                    return tableData;
                });

                break;
            case "clearInput":
                await page.$eval(...params, (e) => (e.value = ""));
                break;
            case "close":
                await browser.close();
                break;
            default:
                await page[i.method](...params);
                break;
        }
        socket.emit("logs", `#${count++}: ${i.method} ✅`);

        i.method === "extractTable" && socket.emit("download", tableData);
    }

    return tableData;
};
