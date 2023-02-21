const express = require("express")
const session = require("express-session");
const app = express()
const mongoose = require("mongoose")
const bodyParser  = require('body-parser');
const Usermodel = require("./models/User")
const localStorage = require("node-localstorage")
const AuthRoute = require("./routes/auth")
const path = require('path');
const PORT = process.env.PORT || 3000;

//SOCKET.IO
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const User = require("./models/User");
const MessageHistory = require("./models/Messages")
const { update } = require("./models/User");
const { all } = require("./routes/auth");
const { ALL } = require("dns");
const { name } = require("ejs");
const io = new Server(server,{
  cors: {origin:"http://localhost:3000"},
  allowEIO3: true
});
global.io = io

// import {LocalStorage} from 'node-localstorage' 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// var localStorage = new LocalStorage('./scratch'); 

var dbURL = "mongodb+srv://wam:whammz123@cluster0.1zsifhy.mongodb.net/?retryWrites=true&w=majority"
mongoose.set('strictQuery', false);

app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/views'));
app.use('/public', express.static('public'));
app.use(
    "/css",
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
  )
  app.use(
    "/js",
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
  )
  app.use("/js", express.static(path.join(__dirname, "node_modules/jquery/dist")))

app.use("/", AuthRoute)

var userlist =[]
io.on('connection',(socket) => {
    //user Connects
    console.log("Connected with Socket IO")
    socket.on("joined-user",async (data) => {
      var getContacts = await User.find({name:data.username}).distinct("contacts")
      var getUserID = await User.find({name:data.username}).distinct("_id")
      var updateSocket = await User.updateOne({name: data.username},
        {socketID: socket.id}
        )
      var getdetails = await (await User.find({name:data.username}).distinct("_id")).toString()
      userlist.push(getdetails)
      socket.emit("joined-user", {username: data.username,contactlist:getContacts,usrID: getUserID})
    })
    //Emitting messages to Clients
    socket.on('send-message', async (data) =>{
      var Sendername = await User.find({name: data.username}).distinct("name")
      var recipientSocketID = await User.find({name:data.recieverName}).distinct("socketID")
      console.log(data.username)
      console.log(data.selectedContact)
      var getrecipientid = userlist.find( x => x == recipientSocketID )
      let MSG = new  MessageHistory ({
        message: data.messageBody,
        senderID: data.userid,
        recipientID: data.recieverid
      })
      MSG.save()  
      io.to(recipientSocketID).emit( 'send-message', {Sendername:Sendername,recieverName:data.recieverName,recieverid:data.recieverid,getrecipientid:getrecipientid,recipientSocketID: recipientSocketID,username: data.username, messageBody: data.messageBody, clientID: socket.id,selectedContact:data.selectedContact})
      socket.emit( 'send-message', {Sendername:Sendername.toString(),recieverName:data.recieverName,recieverid:data.recieverid,getrecipientid:getrecipientid,recipientSocketID: recipientSocketID,username: data.username, messageBody: data.messageBody, clientID: socket.id,selectedContact:data.selectedContact});
    })

    //EMITTING FRIENDLIST
    socket.on("add-contact",async (data) => {
      var friendlist = [] 
      var result = await User.findOne({name: data.contact})
        if(result){
          var match = await User.findOne({name:data.username,contacts: {$in: data.contact}})         
            if(!match){
            friendlist.push(data.contact)
            socket.emit("add-contact", {contact: data.contact,username: data.username})
            var updateUserContact = await User.updateOne({name: data.username},
              {
                $push: {"contacts":data.contact}
              })
            }else{console.log("User Already exists in Contact List")}
        }else{
          console.log("Contact not found")     
        }
    })
    //FOR GENERATING MESSAGE CONVERSATION HISTORY
    socket.on("getMsgHistory", async (data) => {
        var Recipient = await User.find({name: data.recipientName}).distinct("_id")
        var Sender = await User.find({name: data.username}).distinct("_id")
        var recipientid = Recipient.toString()
        var senderID = Sender.toString()
        var messagelogs = await MessageHistory.find({$or:[{senderID: senderID,recipientID:recipientid},{recipientID:senderID,senderID:recipientid} ]})
        //var messagelogsID = await MessageHistory.find({$or:[{senderID: senderID,recipientID:recipientid},{recipientID:senderID,senderID:recipientid} ]},{senderID:1,_id:0})
        var msgList = []
        var idlist = []
        for (let messages of messagelogs){
          msgList.push(messages.message)  
          idlist.push(messages.senderID)        
        } 
        socket.emit("getMsgHistory", {recipientid:recipientid,senderID:senderID, Recipient:data.recipientName,msgList:msgList,idlist:idlist})
    })
  });

server.listen(PORT, () => {
console.log('listening on PORT ${PORT}');
});

async function connect() {
    try {
        await mongoose.connect(dbURL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
        console.log("Connected to MongoDB")
    }catch(error){
        console.error(error);
    }
}
connect()
