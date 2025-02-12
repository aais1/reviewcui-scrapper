import puppeteer from "puppeteer";

// run ./getDepartments.js to get the departments mjy bi udr se mila hai :)
const departments = [
  "Biotechnology",
  "Chemistry",
  "Civil Engineering",
  "Computer Engineering",
  "Computer Science",
  "Development Studies",
  "Earth Sciences",
  "Economics",
  "Electrical Computer Engineering",
  "Environmental Sciences",
  "Humanities",
  "Management Sciences",
  "Mathematics",
  "Pharmacy",
];

export async function getLinks() {
  const browser = await puppeteer.launch();
  console.log("Starting...");
  const page = await browser.newPage();
  await page.setViewport({ width: 1580, height: 1524 });
  const allDepartmentLinks = [];

  for (const department of departments) {
    const departmentUrl =
      "https://www.cuiatd.edu.pk/" + department.toLowerCase().replace(" ", "-");
    console.log(`Visiting: ${departmentUrl}`);

    try {
      await page.goto(departmentUrl, {
        waitUntil: "networkidle0",
        timeout: 120000,
      });

      await page.waitForSelector(".edgt-sidebar");

      const facultyLinks = await page.evaluate(() => {
        const allFacultyLinks = document.querySelectorAll("a");

        const filteredLinks = Array.from(allFacultyLinks)
          .filter(
            (link) =>
              link.textContent.includes("Faculty Profiles") &&
              link.href &&
              !link.href.includes("#")
          )
          .map((link) => link.href);

        return filteredLinks;
      });

      console.log(`Faculty Links for ${department}:`, facultyLinks);
      allDepartmentLinks.push(facultyLinks);
    } catch (error) {
      console.error(`Error while scraping ${department}:`, error);
    }
  }

  console.log("All Department Links:", allDepartmentLinks.flat());
  browser.close();
  return allDepartmentLinks.flat();
}
