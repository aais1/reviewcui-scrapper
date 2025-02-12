//grabing all departments
import puppeteer from "puppeteer";

export async function getDepartments {
  const browser = await puppeteer.launch({ headless: false });
  console.log("Starting...");

  const page = await browser.newPage();
  await page.setViewport({ width: 1580, height: 1524 });

  await page.goto("https://www.cuiatd.edu.pk/", {
    waitUntil: "domcontentloaded",
  });

  await page.waitForSelector(".item_outer .item_text");

  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".item_outer .item_text")).map(
      (el) => el.textContent.trim()
    );
  });

  console.log(links);

  const departmentIndex = links.indexOf("Departments");
  const admissionsIndex = links.indexOf("Admissions");
  console.log(departmentIndex);
  console.log(admissionsIndex);
  const departments = links.slice(departmentIndex + 1, admissionsIndex); 
  
  //idk why uni wloun ne EE ka link he ECE dala hua tha dev shyd high the so this a patch for that
  departments.forEach((department,index)=>{
    if(department.includes('Electrical Engineering')){
      departments[index] = "Electrical Computer Engineering"
    }
  })

  console.log(departments);

  await browser.close();
  return departments
};
