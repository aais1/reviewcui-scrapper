//seeder/update script
import Faculty from "../models/Faculty.js";
import { dbConnect } from "../lib/db.js";

await dbConnect();
try {
  const fac = await Faculty.find().countDocuments();
  console.log(fac);
} catch (e) {
  console.log(e.message);
}
