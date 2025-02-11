import mongoose from 'mongoose'

const FacultySchema = new mongoose.Schema({
    name:String,
    profileImage:String,
    profileLink:String,
    department:String,
    designation:String,
    hecApproved:Boolean,
    interest:String,
})

const Faculty = mongoose.model('Faculty', FacultySchema);
export default Faculty;
