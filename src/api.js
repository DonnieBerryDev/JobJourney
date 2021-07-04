const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const jobModel = require("./models/Job");
const {
  application
} = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");
const config = require('./config.json')

app.use(express.json());
app.use(cors());

mongoose.connect(
  `${config.mongoConnect}`, {
    useNewUrlParser: true,
  }
);

app.post("/jobsearch", async (req, res) => {
  const string = await scrapeJob(req.body.searchUrl);
  await res.send(string);
  console.log(string);
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await jobModel.findByIdAndRemove(id).exec();
  res.send("Deleted");
});

app.post("/insert", async (req, res) => {
  const title = req.body.title;
  const company = req.body.company;
  const salary = req.body.salary;
  const location = req.body.location;
  const job = new jobModel({
    title: title,
    company: company,
    salary: salary,
    location: location,
  });

  try {
    await job.save();
    res.send("qwe");
  } catch {}
});

app.get("/read", (req, res) => {
  jobModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//PORT
const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Listening to port ${port}`));

async function scrapeJob(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
  );
  await page.goto(url);
  await page.screenshot({
    path: "screenshot.png",
  });

  const [title] = await page.$x(
    "/html/body/div[2]/div[5]/div[1]/div[1]/div/div/div[1]/div/div/div[1]/div/h1"
  );
  const titleTxt = await title.getProperty("textContent");
  const rawTitleTxt = await titleTxt.jsonValue();

  const [location] = await page.$x(
    "/html/body/div[2]/div[5]/div[1]/div[1]/div/div/div[1]/div/div/div[1]/section/ul[1]/li[1]/div"
  );
  const locationTxt = await location.getProperty("textContent");
  const rawLocationTxt = await locationTxt.jsonValue();

  const [company] = await page.$x('//*[@id="companyJobsLink"]');
  const companyTxt = await company.getProperty("textContent");
  const rawCompanyTxt = await companyTxt.jsonValue();

  const [salary] = await page.$x(
    "/html/body/div[2]/div[5]/div[1]/div[1]/div/div/div[3]/div/div/p[4]/text()"
  );
  const salaryTxt = await salary.getProperty("textContent");
  const rawSalaryTxt = await salaryTxt.jsonValue();

  browser.close();

  return {
    title: rawTitleTxt,
    location: rawLocationTxt,
    company: rawCompanyTxt,
    salary: rawSalaryTxt,
  };
}