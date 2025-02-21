import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password:String,
    role:{type:String,default:'user'},
})

const Users = mongoose.model("Users", userSchema)

export default Users