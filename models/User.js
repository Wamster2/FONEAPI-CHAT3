const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = Schema ({
    name: String,
    password: String,
    contacts: [],
    socketID: String
},{timestamps:true})



const User = mongoose.model("User", userSchema)

module.exports = User