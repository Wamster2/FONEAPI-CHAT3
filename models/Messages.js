const mongoose = require("mongoose")
const Schema = mongoose.Schema

const messageSchema = Schema ({
    senderID: String,
    recipientID: String,
    message: String,

},{timestamps:true})

const MessageHistory = mongoose.model("MessageHistory", messageSchema)

module.exports = MessageHistory