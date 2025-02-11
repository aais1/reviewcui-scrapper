import puppeteer from 'puppeteer';
import Faculty from '../models/Faculty.js';
import { dbConnect } from '../lib/db.js';


(async () => {
  await dbConnect();
  // Launch the browser
  const browser = await puppeteer.launch({ headless: false }); // Set headless: false for debugging
  const page = await browser.newPage();

  // Navigate to the website
  await page.goto('https://www.cuiatd.edu.pk/computer-science/faculty-profiles-cs/', { waitUntil: 'domcontentloaded',timeout:120000 });

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  // Select all faculty grid elements
  const searchResultSelector = '.faculty-grid';
  await page.waitForSelector(searchResultSelector); // Ensure the element is loaded
  
  // Extract data
  const facultyData = await page.evaluate(() => {
    let facultyElements = document.querySelectorAll('.faculty-grid .faculty-item'); // Adjust selector if necessary
    return Array.from(facultyElements).map((item,inx) =>({
      name: item.querySelector('h3')?.innerText.trim(),  // Extract name
      profileImage:item.querySelector('.profile-image')?.src,
      profileLink:item.querySelector('.view-profile-button')?.href,
      designation: item.querySelector('.faculty-designation')?.innerText?.trim(), // Extract position
      hecApproved:item.querySelector('.hec-supervisor-badge') ? true : false ,
      interest: item.querySelector('.interest-content')?.innerText?.trim(), 
      profileLink: item.querySelector('a')?.href // Extract profile link
    }));
  });

  console.log(facultyData);

  facultyData.forEach(facultyData=>{
    const faculty = new Faculty(facultyData);
    faculty.save().then(()=>{
      console.log(facultyData.name+' saved to the database');
    }).catch((e)=>{
      console.log(e.message);})
    }
  )
  
  await browser.close();
})();
