//seeder/update script
import Faculty from "../models/Faculty.js";
import { dbConnect } from "../lib/db.js";

    await dbConnect();
    try{
        await Faculty.find({}).updateMany(
            { department: { $exists: false } }, // Check if the field is missing
        {
            $set:{
                department:'Computer Science'
            }
        })
        console.log('All data updated from the database');
    }catch(e){
        console.log(e.message);
    }

