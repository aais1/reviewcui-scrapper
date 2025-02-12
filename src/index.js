import puppeteer from "puppeteer";
import Faculty from "../models/Faculty.js";
import { dbConnect } from "../lib/db.js";
import { ExtractDepartment } from "../lib/ExtractDepartment.js";

// List of department URLs for faculty profiles ( get these running the lib function i m too lazy to do that or use the current ones ;))
const allDepLinks = [
  "https://www.cuiatd.edu.pk/biotechnology/faculty-and-staff-profiles-bio/",
  "https://www.cuiatd.edu.pk/chemistry/faculty-profiles-chemistry/",
  "https://www.cuiatd.edu.pk/civil-engineering/faculty-and-staff-profiles-civil/",
  "https://www.cuiatd.edu.pk/computer-engineering/faculty-profiles-ce/",
  "https://www.cuiatd.edu.pk/development-studies/faculty-and-staff-profiles-ds/",
  "https://www.cuiatd.edu.pk/earth-sciences/faculty-and-staff-profiles-earth/",
  "https://www.cuiatd.edu.pk/economics/faculty-profiles-economics/",
  "https://www.cuiatd.edu.pk/electrical-computer-engineering/faculty-and-staff-profiles-ee/",
  "https://www.cuiatd.edu.pk/environmental-sciences/faculty-profiles-es/",
  "https://www.cuiatd.edu.pk/humanities/faculty-profiles-humanities/",
  "https://www.cuiatd.edu.pk/management-sciences/faculty-profiles-ms/",
  "https://www.cuiatd.edu.pk/mathematics/faculty-and-staff-profiles-maths/",
  "https://www.cuiatd.edu.pk/pharmacy/faculty-and-staff-profiles-pharmacy/",
];

//"https://www.cuiatd.edu.pk/computer-science/faculty-profiles-cs/",

(async () => {
  await dbConnect();

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Iterate over each department link
  for (const departmentUrl of allDepLinks) {
    console.log(`Visiting: ${departmentUrl}`);
    const department = ExtractDepartment(departmentUrl);

    await page.goto(departmentUrl, {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });

    await page.setViewport({ width: 1080, height: 1024 });

    const searchResultSelector = ".faculty-grid";
    await page.waitForSelector(searchResultSelector);

    // Extract data
    const facultyData = await page.evaluate(() => {
      const facultyElements = document.querySelectorAll(
        ".faculty-grid .faculty-item"
      );
      return Array.from(facultyElements).map((item) => ({
        name: item.querySelector("h3")?.innerText.trim(),
        profileImage: item.querySelector(".profile-image")?.src,
        profileLink: item.querySelector(".view-profile-button")?.href,
        designation: item
          .querySelector(".faculty-designation")
          ?.innerText?.trim(),
        hecApproved: item.querySelector(".hec-supervisor-badge") ? true : false,
        interest: item.querySelector(".interest-content")?.innerText?.trim(),
        profileLink: item.querySelector("a")?.href,
      }));
    });

    console.log(`Faculty Links for ${departmentUrl}:`, facultyData);

    facultyData.forEach((faculty) => {
      const facultyInstance = new Faculty({
        ...faculty,
        department,
      });
      facultyInstance
        .save()
        .then(() => {
          console.log(`${faculty.name} saved to the database`);
        })
        .catch((e) => {
          console.log(e.message);
        });
    });
  }

  await browser.close();
})();
