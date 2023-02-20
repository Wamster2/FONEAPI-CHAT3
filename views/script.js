
const socket = io()

let clientID;
let  selectedContact = ''
//GET HTML ELEMENTS FOR SOCKET EVENTS
var usernameInput = document.getElementById("addcontactInput")
var sidebar = document.getElementById("sidebar-list-wrapper")
var userDetails = document.getElementById("username")
var sendMessage = document.getElementById("send-btn")
var addcontact = document.getElementById("add-contactbtn")
var messageBody = document.getElementById("messagebody")
var messageBox = document.getElementById("messagewrapper")
var addcontactInput = document.getElementById("addcontactInput")
var friendList = document.getElementById("list-group")
var ID = document.getElementById("userID")
var recieverID = document.getElementById("recipient-ID")
var recipientNames = document.getElementById("recipient-Name")
var LogoutBtn = document.getElementById("logOutBtn")

//Fetch URL Params from URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('username');

//Emitting username and roomname of newly joined user to server
socket.emit('joined-user', {
    username: username,  
},userDetails.innerHTML += username)
socket.on("logout", () => {
    socket.disconnect(true)
})
socket.on("joined-user", (data) => {
    console.log(data.contactlist)
    var friends = data.contactlist
    console.log(data.usrID)
    ID.innerHTML = data.usrID
    for (let name of friends ){
        var li = document.createElement("li")
        var notif = document.createElement("p")
        li.appendChild(document.createTextNode(name))
        friendList.appendChild(li)
        notif.style.fontSize = "15px"
        notif.style.fontWeight = "bold"
        li.style.height = "50px"
        li.style.padding = "5px"
        li.style.borderBottom = "2px solid #575757"
        li.style.display = "block"
        li.style.listStyle = "none"
        li.classList.add("link")
        li.setAttribute("tabindex","1")
        li.addEventListener("click",(e) => {
            li.classList.add("active")
            selectedContact = e.target.innerHTML
            socket.emit("getMsgHistory",{
                username: username, 
                recipientName: name,
            })

        })

        socket.on("getMsgHistory",(data) => {
            messageBox.scrollTop = messageBox.scrollHeight
            clientID = socket.id
            messageBox.innerHTML =   data.Recipient + "  " + data.recipientid
            recieverID.innerHTML =   data.recipientid
            recipientNames.innerHTML = data.Recipient
            var y = data.msgList
            var z = data.idlist
            y.forEach((msg,index) => {
                const sID = z[index]
                if (data.senderID == sID) {
                    const messageLog = document.createElement('div')
                    const time = new Date();
                    const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
                
                    ///STYLE FOR SENDER
                    messageLog.style.borderRadius = "5px"
                    messageLog.style.padding = "10px"
                    messageLog.style.margin = "10px"
                    messageLog.style.width = "max-content"
                    messageLog.style.background = "#e3e3e3"
                    messageLog.style.color = "black "
                    messageLog.style.marginLeft = "auto"
                    messageLog.style.overflowWrap = "anywhere"
                    messageLog.style.maxWidth = "40%"
                    messageLog.innerText = msg
                    messageBox.append(messageLog)
                }else{
                    ///STYLE FOR RECIEVER
                    const messageLog = document.createElement('div')
                    const time = new Date();
                    const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
            
                    messageLog.style.borderRadius = "5px"
                    messageLog.style.padding = "10px"
                    messageLog.style.margin = "10px"
                    messageLog.style.width = "max-content"
                    messageLog.style.background = "#0c6be8"
                    messageLog.style.color = "white"
                    messageLog.style.overflowWrap = "anywhere"
                    messageLog.style.maxWidth = "50%"             
                    messageLog.innerText = msg
                    messageBox.append(messageLog)
                } 
            })

        })
    }
})

//ADD FRIEND FEATURE
addcontact.addEventListener("click",() => {
    socket.emit("add-contact", {
        contact: addcontactInput.value,
        username: username,
    })
})
socket.on("add-contact", (data) => {
    recipientNames.innerHTML = data.contact
    const  li = document.createElement("li")
    li.appendChild(document.createTextNode(data.name))
    friendList.appendChild(li)
    li.style.height = "50px"
    li.style.padding = "5px"
    li.style.borderBottom = "2px solid #575757"
    li.style.display = "block"
    li.style.listStyle = "none"
    li.classList.add("link")
    li.setAttribute("tabindex","1")
    li.innerHTML = data.contact
    li.addEventListener("click",() => {
        socket.emit("getMsgHistory",{
            username: username, 
            recipientName: data.contact,
            
            
        })
    })

})
sendMessage.addEventListener("click",() => {
    socket.emit("send-message", {     
        username: username,
        messageBody: messageBody.value,
        userid : ID.innerText,
        recieverid: recieverID.innerText,
        recieverName: recipientNames.innerText,
        selectedContact: selectedContact,
    })
    messageBody.value = ""
})
//Displaying the message sent from user
socket.on('send-message', async (data) => {
    messageBox.scrollTop = messageBox.scrollHeight
    var sender_name = data.Sendername.toString()
    console.log(selectedContact)
    clientID = socket.id
    // if(data.recieverName === selectedContact){
    //     console.log("Not match")
    // }else{
        if (clientID === data.clientID) {
            const  wrapper = document.createElement("div")
            const messageLog = document.createElement('div')
            const  details = document.createElement("div")
            const time = new Date();
            const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
        
            messageLog.style.borderRadius = "5px"
            messageLog.style.padding = "10px"
            messageLog.style.margin = "10px"
            messageLog.style.width = "max-content"
            messageLog.style.background = "#e3e3e3"
            messageLog.style.color = "black "
            messageLog.style.marginLeft = "auto"
            // messageLog.style.marginRight = "auto"
            messageLog.style.overflowWrap = "anywhere"
            messageLog.style.maxWidth = "50%"
            messageLog.innerText = data.messageBody
            messageBox.append(messageLog)
        }else{
            const messageLog = document.createElement('div')
            const time = new Date();
            const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });

            messageLog.style.borderRadius = "5px"
            messageLog.style.padding = "10px"
            messageLog.style.margin = "10px"
            messageLog.style.width = "max-content"
            messageLog.style.background = "#0c6be8"
            messageLog.style.color = "white"
            messageLog.style.overflowWrap = "anywhere"
            messageLog.style.maxWidth = "50%"
        
            messageLog.innerText = data.messageBody
            messageBox.append(messageLog)
        }
    // }
})