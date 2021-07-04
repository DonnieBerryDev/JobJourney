const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrapeJob(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36')
    await page.goto(url);
    await page.screenshot({
        path: 'screenshot.png'
    });
    const [el] = await page.$x('/html/body/div[2]/div[5]/div[1]/div[1]/div/div/div[1]/div/div/div[1]/div/h1');
    const txt = await el.getProperty("textContent");
    const rawTxt = await txt.jsonValue();

    console.log({
        rawTxt
    });

    browser.close()
}

scrapeJob(
    "https://www.totaljobs.com/job/lecturer-computing/bluetownonline-ltd-job93465843"
);